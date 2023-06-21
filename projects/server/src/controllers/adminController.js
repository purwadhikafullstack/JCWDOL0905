const db = require("../models");
const admins = db.Admin;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY

module.exports = {
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      if (!email || !password)
        return res.status(404).send({isError: true, message: "Please fill all the required fields"});
      let resultAdmin = await admins.findOne({where: {email: email}});
      if (!resultAdmin) {
        return res.status(404).send({isError: true, message: "Invalid email or password"})}
      bcrypt.compare(password, resultAdmin.password, async (err, result) => {
        if (err) {
          res.status(404).send({isError: true, message: "Login failed when comparing password"});
        } else if (result) {
          const token = jwt.sign({id_admin: resultAdmin.id, email: resultAdmin.email, role: resultAdmin.role}, jwtKey)
          await admins.update({token_admin: token}, {where: {id: resultAdmin.id}});
          let getAdmin = await admins.findOne({where: {id: resultAdmin.id}});
          delete getAdmin.dataValues.password;
          res.status(200).send({isError: false, message: "Login Success", data: getAdmin});
        } else {
          return res.status(404).send({isError: true, message: "Invalid email or password"})}
      });
    } catch (error) {
      console.log(error); res.status(404).send({isError: true, message: "Login Failed"})}
  },
  createNewAdmin: async (req, res) => {
    try {
      let { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(404).send({isError: true, message: "Please fill all the required fields"});
      let charEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!charEmail.test(email))
        return res.status(404).send({ isError: true, message: "Invalid email format" });
      let findEmail = await admins.findOne({ where: { email: email } });
      if (findEmail)
        return res.status(404).send({ isError: true, message: "Email already exists" });
      let char = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/;
      if (!char.test(password))
        return res.status(404).send({isError: true, message: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number"});
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(req.body.password, salt);
      const result = await admins.create({admin_name: name, email, password: hashPass, role: "BRANCH_ADMIN"});
      res.status(201).send({isError: false, message: "New admin account has been created successfully", data: result});
    } catch (error) {
      console.log(error); res.status(404).send({isError: true, message: "Register failed"})}
  },
  getAdminByToken: async (req, res) => {
    try {
      const admin = jwt.verify(req.params.token, jwtKey);
      const getAdmin = await admins.findOne({where: {id: admin.id_admin}})
      res.send({code: 200, message: "Get admin by token success", admin: getAdmin})
    } catch(error){
      res.status(400).send({ error: "Invalid token" });
    }
  },
};