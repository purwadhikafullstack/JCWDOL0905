const db = require("../models");
const admins = db.Admin;
const branch = db.Store_Branch;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;
const { Op } = require("sequelize");

module.exports = {
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      if (!email || !password)
        return res.status(404).send({ isError: true, message: "Please fill all the required fields", });
      let resultAdmin = await admins.findOne({ where: { email: email } });
      if (!resultAdmin) {
        return res .status(404) .send({ isError: true, message: "Invalid email or password" });
      }
      bcrypt.compare(password, resultAdmin.password, async (err, result) => {
        if (err) {
          res.status(404).send({ isError: true, message: "Login failed when comparing password", });
        } else if (result) {
          const token = jwt.sign( { id_admin: resultAdmin.id, email: resultAdmin.email, role: resultAdmin.role, }, jwtKey );
          await admins.update( { token_admin: token }, { where: { id: resultAdmin.id } } );
          let getAdmin = await admins.findOne({ where: { id: resultAdmin.id }, });
          delete getAdmin.dataValues.password;
          res .status(200) .send({ isError: false, message: "Login Success", data: getAdmin });
        } else {
          return res .status(404) .send({ isError: true, message: "Invalid email or password" });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(404).send({ isError: true, message: "Login Failed" });
    }
  },
  createNewAdmin: async (req, res) => {
    try {
      let { name, email, password, branchId } = req.body;
      if (!name || !email || !password || !branchId)
        return res.status(404).send({ isError: true, message: "Please fill all the required fields", });
      let charEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!charEmail.test(email))
        return res .status(404) .send({ isError: true, message: "Invalid email format" });
      let findEmail = await admins.findOne({ where: { email: email } });
      if (findEmail)
        return res .status(404) .send({ isError: true, message: "Email already exists" });
      let char =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/;
      if (!char.test(password))
        return res.status(404).send({ isError: true, message: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number", });
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(req.body.password, salt);
      const result = await admins.create({ admin_name: name, email, password: hashPass, role: "BRANCH_ADMIN", id_branch: branchId });
      res.status(201).send({ isError: false, message: "New admin account has been created successfully", data: result, });
    } catch (error) {
      console.log(error);
      res.status(404).send({ isError: true, message: "Adding new branch admin failed" });
    }
  },
  editAdmin: async (req, res) => {
    try {
      const { name, email, password, branchId } = req.body;
      const { id } = req.params;
      if (!name || !email || !branchId) {
        return res.status(404).send({ isError: true, message: "Please fill all the required fields", });
      }
      const charEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!charEmail.test(email)) {
        return res.status(404).send({ isError: true, message: "Invalid email format", });
      }     
      const findUserById = await admins.findOne({ where: { id: id }, });
      const findEmail = await admins.findAll({ where: { email: { [Op.ne]: findUserById.email } }, });
      for (const element of findEmail) {
        if (email === element.email) {
          return res.status(404).send({ isError: true, message: "User already exists, use other email", });
        }
      }  
      const char =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/;
      if (password && !char.test(password)) {
        return res.status(404).send({ isError: true, message: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number", });
      }  
      const salt = await bcrypt.genSalt(10);
      const hashPass = password ? await bcrypt.hash(password, salt) : undefined;
      const updateData = { admin_name: name, email, id_branch: branchId, };
      if (hashPass) {
        updateData.password = hashPass;
      }
      const result = await admins.update(updateData, {
        where: { id: id },
      });  
      if (result[0] === 0) {
        return res.status(404).send({ isError: true, message: "User not found", });
      }  
      res.status(200).send({ isError: false, message: "User has been updated successfully", data: { admin_name: name, email, password: hashPass, id_branch: branchId, }, });
    } catch (error) {
      console.log(error);
      res.status(404).send({ isError: true, message: "Update failed" });
    }
  },
  getAdminByToken: async (req, res) => {
    try {
      const admin = jwt.verify(req.params.token, jwtKey);
      const getAdmin = await admins.findOne({ where: { id: admin.id_admin } });
      res.send({ code: 200, message: "Get admin by token success", admin: getAdmin, });
    } catch (error) {
      res.status(400).send({ error: "Invalid token" });
    }
  },
  getBranchAdmin: async (req, res) => {
    try {
      const { page, limit, filterState, filterType } = req.query;
      const whereCondition = { role: "BRANCH_ADMIN", };
      if (filterState && filterType === "name") {
        whereCondition.admin_name = { [Op.like]: `%${filterState}%`, };
      }
      if (filterState && filterType === "email") {
        whereCondition.email = { [Op.like]: `%${filterState}%`, };
      }
      const resultBranchAdmin = await admins.findAndCountAll({
        where: whereCondition,
        attributes: ["id", "admin_name", "email", "role", "id_branch"],
        include: [
          {
            model: branch,
            attributes: ["branch_name"],
          },
        ],
        limit: Number(limit),
        offset: Number(page) * Number(limit),
      });
      const { count, rows } = resultBranchAdmin;
      const totalPages = Math.ceil(count / Number(limit));
      return res.status(200).json({ totalItems: count, totalPages, currentPage: Number(page), data: rows, });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "error while request" });
    }
  },
  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      let resultAdmin = await admins.findOne({ where: { id: id } });
      if (!resultAdmin) {
        return res .status(404) .send({ isError: true, message: "user not found" });
      }
      const result = await admins.destroy({ where: { id: id, }, });
      res.status(202).send({ message: `Success delete admin data with id = ${id}`, data: result, });
    } catch (error) {
      res.status(400).send({ message: "error while request delete" });
    }
  },
};