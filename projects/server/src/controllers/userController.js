const db = require("../models");
const users = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokens = db.Token;
const sendEmail = require("../helper/sendEmail");
const { join } = require("path");
require('dotenv').config({ path: join(__dirname, '../.env') });
const jwtKey = process.env.JWT_SECRET_KEY;
const { checkReferralCodeUniqueness, generateRandomReferralCode } = require('../helper/referralCodeGenerator');
const { where } = require("sequelize");
const client_url = process.env.CLIENT_URL

module.exports = {
  register: async (req, res) => {
    try {
      let { name, email, password, phone_number } = req.body;
      if (!name || !email || !password || !phone_number)
        return res.status(404).send({isError: true, message: "Please fill all the required fields"});
      let charEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!charEmail.test(email))
        return res.status(404).send({ isError: true, message: "Invalid email format" });
      let findEmail = await users.findOne({ where: { email: email } });
      if (findEmail)
        return res.status(404).send({ isError: true, message: "Email already exists" });
      let char = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/;
      if (!char.test(password))
        return res.status(404).send({isError: true, message: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number"});
      if (isNaN(phone_number) || phone_number.length < 9 || phone_number.length > 12)
        return res.status(404).send({isError: true, message: "Please input a valid phone number"});
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(req.body.password, salt);
      let referralCode = generateRandomReferralCode(10);
      let isUnique = await checkReferralCodeUniqueness(referralCode);
      while (!isUnique) {
        referralCode = generateRandomReferralCode(10);
        isUnique = await checkReferralCodeUniqueness(referralCode)}
      const result = await users.create({name, email, password: hashPass, phone_number, referral_code: referralCode});
      const token = jwt.sign({ id_user: result.id, name: result.name, email: result.email }, jwtKey, { expiresIn: '1h' });
      await tokens.create({id_user: result.id, token: token, token_type: "VERIFICATION"});
      const url = `${client_url}/verify?id_user=${result.id}&token=${token}`;
      const message = `<p>Click this link to verify: <a href='${url}'>${url}</a></p>`;
      await sendEmail(result.email, "Verify Account", message);
      res.status(201).send({isError: false, message: "Register Success! Please Check Email to Verify", data: result});
    } catch (error) {
      console.log(error); res.status(404).send({isError: true, message: "Register failed"})}},
  verify: async (req, res) => {
    const { id_user, token } = req.params
    try {
      const tokenData = await tokens.findOne({where: {token: token}});
      if (!tokenData) {
        return res.status(400).send({ code: 400, message: "Invalid or expired token" })}
      const checkTokenValidity = jwt.verify(token, jwtKey);
      const [affectedRows] = await users.update({ is_verified: 1 },{where: {id: checkTokenValidity.id_user}}) 
      if (affectedRows === 0) {
        return res.status(404).send({ code: 404, message: `User not found with id : ${id_user}` })}
      const deletedRows = await tokens.update({token: null, token_type: null}, {where: {id_user: checkTokenValidity.id_user}});
      if (deletedRows === 0) {
        return res.status(404).send({ code: 404, message: "Token is not found" });}
      res.status(200).send({code: 200, message: "Verification success"});
    } catch (err) {
      console.log(err);
      return res.status(500).send({ code: 500, message: "Internal server error" })}},
  resendVerification: async (req, res) => {
    try {
      const { email } = req.body;
      let result = await users.findOne({where: {email: email}});
      if (!result)
        return res.status(404).send({message: "Email doesn't exist"});
      const newToken = jwt.sign({ id_user: result.id, name: result.name, email: result.email }, jwtKey, { expiresIn: '1h' })
      const [affectedRows] = await tokens.update({ token: newToken, token_type: "VERIFICATION" },{where: {id_user: result.id}})
      if (affectedRows === 0) {
        return res.status(404).send({code: 404, message: `Token for that email is not found, maybe the token already used ,try login `})}
      const url = `${client_url}/verify?id_user=${result.id}&token=${newToken}`;
      const message = `<p>Click this link to verify: <a href='${url}'>${url}</a></p>`;
      await sendEmail(result.email, "Verify Account", message);
      res.status(200).send({code: 200, message: "A verification email has been sent. Please check your email and verify"});
    } catch (error) {
      console.log(error); res.status(500).send({ message: "Internal server error" })}},
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      if (!email || !password)
        return res.status(404).send({isError: true, message: "Please fill all the required fields"});
      let resultUser = await users.findOne({where: {email: email}});
      if (!resultUser) {
        return res.status(404).send({isError: true, message: "Invalid email or password"})}
      bcrypt.compare(password, resultUser.password, async (err, result) => {
        if (err) {
          res.status(404).send({isError: true, message: "Login failed when comparing password"});
        } else if (result) {
          const token = jwt.sign({id_user: resultUser.id, name: resultUser.name, email: resultUser.email, is_verified: resultUser.is_verified}, jwtKey, { expiresIn: '1h' })
          await tokens.update({token: token, token_type: "ACCESS_TOKEN"}, {where: {id_user: resultUser.id}});
          delete resultUser.dataValues.password;
          res.status(200).send({isError: false, message: "Login Success", data: {access_token: token, id_user: resultUser.id, user : resultUser}});
        } else {
          return res.status(404).send({isError: true, message: "Invalid email or password"})}
      });
    } catch (error) {
      console.log(error); res.status(404).send({isError: true, message: "Login Failed"})}},
  forgotPasswordSendEmail: async (req, res) => {
    try {
      const { email } = req.body;
      let result = await users.findOne({where: {email: email}});
      if (!result)
        return res.status(404).send({message: "Email doesn't exist"});
      const newToken = jwt.sign({ id_user: result.id, name: result.name, email: result.email }, jwtKey, { expiresIn: '1h' });      
      await tokens.update({token: newToken, token_type: "FORGOT_PASSWORD"}, {where: {id_user: result.id}});
      const url = `${client_url}/verify-forgot-password?id_user=${result.id}&token=${newToken}`;
      const message = `<p>Click this link to reset password: <a href='${url}'>${url}</a></p>`;
      await sendEmail(result.email, "Reset Password", message);
      res.status(200).send({data: {token: newToken}, message: "Check your email to reset password", code: 200})
    } catch (error) {
      console.log(error)}},
  resendEmailForgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      let result = await users.findOne({where: {email: email}});
      if (!result)
        return res.status(404).send({message: "Email doesn't exist"});
      const newToken = jwt.sign({ id_user: result.id, name: result.name, email: result.email }, jwtKey, { expiresIn: '1h' })
      const [affectedRows] = await tokens.update({ token: newToken, token_type: "FORGOT_PASSWORD" },{where: {id_user: result.id}})
      if (affectedRows === 0) {
        return res.status(404).send({code: 404, message: `Token for user id : ${id_user} is not found`})}
      const url = `${client_url}/verify-forgot-password?id_user=${result.id}&token=${newToken}`;
      const message = `<p>Click this link to reset password: <a href='${url}'>${url}</a></p>`;
      await sendEmail(result.email, "Reset Password", message);
      res.status(200).send({data: {token: newToken}, message: "Check your email to reset password", code: 200});
    } catch (error) {
      console.log(error)}},
  verifyForgotPassword: async (req, res) => {
    const { id_user, token } = req.params;
    try {
      const tokenData = await tokens.findOne({where: {token: token}});
      const checkTokenValidity = jwt.verify(token, jwtKey);
      if (!tokenData) {
        return res.status(400).send({code: 400, message: `Invalid or expired token for id user`})}
      res.status(200).send({code: 200, message: "Verification success"});
    } catch (err) {
      console.log(err);
      return res.status(500).send({ code: 500, message: "Internal server error" })}},
  resetPassword: async (req, res) => {
    const { token, password, confirmPassword } = req.body;
    try {
      if (!confirmPassword || !password)
        return res.status(404).send({isError: true, message: "Please fill all the required fields"});
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(password))
        return res.status(404).send({isError: true, message: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number"});
      if (password !== confirmPassword) {
        return res.status(400).send({ message: "Password doesn't match" })}
      const payload = jwt.verify(token, jwtKey);
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);
      const [affectedRows] = await users.update({ password: hashPass }, {where: {email: payload.email}})
      if (affectedRows === 0) {
        return res.status(404).send({code: 404, message: `User with email : ${payload.email} is not found. Please use valid URL sent to your email`})}
      const deletedRows = await tokens.update({token: null, token_type: null}, {where: {token: token}});
      if (deletedRows === 0) {
        return res.status(404).send({ code: 404, message: "Token not found" });
      }
      res.status(200).send({code: 200, message: "Success reset password, please login"});
    } catch (error) {
      res.status(400).send({ error: "Invalid token" })}},
  getUserByToken: async (req, res) => {
    try {
      let bearerToken = req.headers['authorization'];
      bearerToken = bearerToken.split(' ')[1]
      const user = jwt.verify(bearerToken, jwtKey);
      const getUser = await users.findOne({where: {id: user.id_user}})
      res.send({code: 200, message: "Get user by token success", user: getUser})
    } catch(error){
      res.status(400).send({ error: "Invalid token" });
    }},
  changePassword: async (req, res) => {
    try {
      let { id_user, oldPassword, newPassword, confirmNewPassword } = req.body;
      if (!oldPassword || !newPassword || !confirmNewPassword) 
        return res.status(404).send({isError: true, message: "Please fill all the required fields"});
      const findUser = await users.findByPk(id_user)
      if (!findUser)
        return res.status(404).send({isError: true, message: "User not found"})
      const isPasswordMatch = await bcrypt.compare(oldPassword, findUser.password)
      if (!isPasswordMatch)
        return res.status(404).send({isError: true, message: "Wrong old password"})
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(newPassword))
        return res.status(404).send({isError: true, message: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number"})
      if (confirmNewPassword !== newPassword)
        return res.status(404).send({isError: true, message: "New password and confirm new password do not match"});
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      await users.update({password: hashedNewPassword}, {where: {id: id_user}})
      res.status(200).send({isError: false, message: "Change password success"});
    } catch (error) {
      console.log(error);
      res.status(404).send({isError: true, message: "Change password failed"})}}
};
