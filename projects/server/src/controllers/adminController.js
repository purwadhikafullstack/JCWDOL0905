const db = require("../models");
const admins = db.Admin;
const branch = db.Store_Branch;
const users = db.User;
const Transaction_Header = db.Transaction_Header;
const Inventories = db.Inventories
const Transaction_Detail = db.Transaction_Detail
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;
const { Op } = require("sequelize");
const { Sequelize} = require('sequelize');

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
        return res.status(404).send({ isError: true, message: "Invalid email format" });
      let findEmail = await admins.findOne({ where: { email: email } });
      if (findEmail)
        return res.status(404) .send({ isError: true, message: "Email already exists" });
      let char = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/;
      if (!char.test(password))
        return res.status(404) .send({ isError: true, message: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number", });
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(req.body.password, salt);
      const result = await admins.create({ admin_name: name, email, password: hashPass, role: "BRANCH_ADMIN", id_branch: branchId, });
      res.status(201) .send({ isError: false, message: "New admin account has been created successfully", data: result, });
    } catch (error) {
      console.log(error);
      res.status(404) .send({ isError: true, message: "Adding new branch admin failed" });
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
        return res.status(404).send({ isError: true, message: "Invalid email format" });
      }
      const findUserById = await admins.findOne({ where: { id: id } });
      const findEmail = await admins.findAll({ where: { email: { [Op.ne]: findUserById.email } }, });
      for (const element of findEmail) {
        if (email === element.email) {
          return res.status(404).send({ isError: true, message: "User already exists, use other email", });
        }
      }
      const char = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/;
      if (password && !char.test(password)) {
        return res.status(404).send({ isError: true, message: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number", });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPass = password ? await bcrypt.hash(password, salt) : undefined;
      const updateData = { admin_name: name, email, id_branch: branchId };
      if (hashPass) { updateData.password = hashPass; }
      const result = await admins.update(updateData, { where: { id: id }, });
      if (result[0] === 0) {
        return res .status(404).send({ isError: true, message: "User not found" });
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
      const whereCondition = { role: "BRANCH_ADMIN" };
      if (filterState && filterType === "name") {
        whereCondition.admin_name = { [Op.like]: `%${filterState}%` };
      }
      if (filterState && filterType === "email") {
        whereCondition.email = { [Op.like]: `%${filterState}%` };
      }
      const resultBranchAdmin = await admins.findAndCountAll({ where: whereCondition, attributes: ["id", "admin_name", "email", "role", "id_branch"], include: [ { model: branch, attributes: ["branch_name"], }, ], limit: Number(limit), offset: Number(page - 1) * Number(limit), });
      const { count, rows } = resultBranchAdmin;
      const totalPages = Math.ceil(count / Number(limit));
      return res .status(200) .json({ totalItems: count, totalPages, currentPage: Number(page), data: rows, });
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
        return res.status(404) .send({ isError: true, message: "user not found" });
      }
      const result = await admins.destroy({ where: { id: id } });
      res.status(202) .send({ message: `Success delete admin data with id = ${id}`, data: result, });
    } catch (error) {
      res.status(400).send({ message: "Error while request delete" });
    }
  },
  getDashboardData: async (req, res) => {
    try {
      let { year } = req.query;
      year = year || "2023";
      const totalUser = await users.count();
      const totalTransactions = await Transaction_Header.count({ where: { createdAt: {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      }, order_status: { [Op.or]: ["done", "shipped"] } }, });
      const totalSales = await Transaction_Header.sum("final_price", { where: { createdAt: {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      }, order_status: { [Op.or]: ["done", "shipped"] } }, });
      const totalSalesResult = await Transaction_Header.findAll({ attributes: [ [Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m')"), "name"], [Sequelize.fn("SUM", Sequelize.col("final_price")), "totalSales"], ], where: { order_status: { [Op.or]: ["done", "shipped"] },
      createdAt: {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      },
    }, group: [Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m')")], order: [[Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m')"), "ASC"]], });
      let maxMonthlySales = 0;
      for (const monthSales of totalSalesResult) {
        if (Number(monthSales.dataValues.totalSales) > maxMonthlySales) {
          maxMonthlySales = Number(monthSales.dataValues.totalSales);
        }
      }
      const result = { totalUser, totalTransactions, totalSales, totalSalesResult, maxMonthlySales, };
      res.status(202) .send({ message: `Success get dashboard data`, data: result });
    } catch (error) {
      res.status(400).send({ message: "Error while request dashboard data" });
    }
  },
  getDashboardDataPerBranch: async (req, res) => {
    let { id, year } = req.query;
    year = year || "2023";
    const rawQuery = `
    SELECT DATE_FORMAT(Transaction_Headers.createdAt, '%Y-%m') AS name, SUM(Transaction_Headers.final_price) AS totalSales
    FROM (
      SELECT Transaction_Details.*, Store_Branches.id AS branch_id
      FROM Transaction_Details
      JOIN Inventories ON Transaction_Details.id_inventory = Inventories.id
      JOIN Store_Branches ON Inventories.id_branch = Store_Branches.id
    ) AS CombinedQuery
    JOIN Transaction_Headers ON CombinedQuery.id_trans_header = Transaction_Headers.id
    WHERE order_status IN ('done', 'shipped') AND CombinedQuery.branch_id = :branchId AND YEAR(Transaction_Headers.createdAt) = :year
    GROUP BY DATE_FORMAT(Transaction_Headers.createdAt, '%Y-%m')
    ORDER BY DATE_FORMAT(Transaction_Headers.createdAt, '%Y-%m') ASC;`;
    const query2 = `SELECT COUNT(Transaction_Headers.id) as totalTransactions,SUM(Transaction_Headers.final_price) AS totalSales
    FROM (
      SELECT Transaction_Details.*, Store_Branches.id AS branch_id
      FROM Transaction_Details
      JOIN Inventories ON Transaction_Details.id_inventory = Inventories.id
      JOIN Store_Branches ON Inventories.id_branch = Store_Branches.id
    ) AS CombinedQuery
    JOIN Transaction_Headers ON CombinedQuery.id_trans_header = Transaction_Headers.id
    WHERE order_status IN ('done', 'shipped') AND CombinedQuery.branch_id = :branchId  AND YEAR(Transaction_Headers.createdAt) = :year;`;
    try {
      const totalUser = await users.count();
      const [result] = await db.sequelize.query(rawQuery, { replacements: { branchId: id, year: year }, });
      const [result2,] = await db.sequelize.query(query2, { replacements: { branchId: id, year: year}, });      
      let maxMonthlySales = 0;
      for (const monthSales of result) {
        if (Number(monthSales.totalSales) > maxMonthlySales) {
          maxMonthlySales = Number(monthSales.totalSales);
        }
      }
      const data = { totalUser, totalTransactions: result2[0].totalTransactions, totalSales: result2[0].totalSales, totalSalesResult: result, maxMonthlySales, };
      res.status(202) .send({ message: `Success delete admin data with id = ${id}`, data: data, });
    } catch (error) {
      res.status(400).send({ message: "error while request dashboard data" });
    }
  },
  getSalesReport: async (req, res) => {
    let { orderBy, orderByMethod, branchId, startDate, endDate, page, limit, productName, userName, transactionId} = req.query;
    const mapOrderBy = {createdAt: "Transaction_Headers.createdAt", productQuantity: "CombinedQuery.product_qty"};
    orderBy = mapOrderBy[orderBy] || "Transaction_Headers.id";
    orderByMethod = orderByMethod || "ASC";
    branchId = branchId || "";
    productName = productName ? `%${productName}%` : "";
    userName = userName ? `%${userName}%` : "";
    transactionId = transactionId ? `%${transactionId}%` : "";
    startDate = startDate || "1970-01-01 00:00:00";
    endDate = endDate || "9999-12-31 23:59:59";
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const salesReportQuery = `
    SELECT Transaction_Headers.id, CombinedQuery.branch_name as branchName ,Transaction_Headers.createdAt, Users.name, CombinedQuery.productName, CombinedQuery.product_price, CombinedQuery.product_qty, CombinedQuery.product_price * CombinedQuery.product_qty as total_price
    FROM (
      SELECT Transaction_Details.*, Store_Branches.branch_name, Products.product_name as productName, Store_Branches.id as branchId
      FROM Transaction_Details
      JOIN Inventories ON Transaction_Details.id_inventory = Inventories.id
      JOIN Products ON Inventories.id_product = Products.id
      JOIN Store_Branches ON Inventories.id_branch = Store_Branches.id
    ) AS CombinedQuery
    JOIN Transaction_Headers ON CombinedQuery.id_trans_header = Transaction_Headers.id
    JOIN Users ON Transaction_Headers.id_user = Users.id
    WHERE Transaction_Headers.order_status IN ('done', 'shipped') 
    AND ${branchId ? "CombinedQuery.branchId = :branchId" : "1 = 1"}
    AND Transaction_Headers.createdAt BETWEEN :startDate AND :endDate
    AND ${productName ? "CombinedQuery.productName LIKE :productName" :"1 = 1"}
    AND ${userName ? "Users.name LIKE :userName" :"1 = 1"}
    AND ${transactionId ? "Transaction_Headers.id LIKE :transactionId" :"1 = 1"}
    ORDER BY
    ${orderBy} ${orderByMethod}
    LIMIT :limit
    OFFSET :offset;`

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT Transaction_Details.*, Store_Branches.branch_name, Products.product_name as productName, Store_Branches.id as branchId
      FROM Transaction_Details
      JOIN Inventories ON Transaction_Details.id_inventory = Inventories.id
      JOIN Products ON Inventories.id_product = Products.id
      JOIN Store_Branches ON Inventories.id_branch = Store_Branches.id
    ) AS CombinedQuery
    JOIN Transaction_Headers ON CombinedQuery.id_trans_header = Transaction_Headers.id
    JOIN Users ON Transaction_Headers.id_user = Users.id
    WHERE Transaction_Headers.order_status IN ('done', 'shipped') 
    AND ${branchId ? "CombinedQuery.branchId = :branchId" : "1 = 1"}
    AND Transaction_Headers.createdAt BETWEEN :startDate AND :endDate
    AND ${productName ? "CombinedQuery.productName LIKE :productName" :"1 = 1"}
    AND ${userName ? "Users.name LIKE :userName" :"1 = 1"}
    AND ${transactionId ? "Transaction_Headers.id LIKE :transactionId" :"1 = 1"}
    ;`
    const result = await db.sequelize.query(salesReportQuery, { replacements: { branchId, startDate, endDate, limit, offset, productName, userName, transactionId}, });
    const countResult = await db.sequelize.query(countQuery, { replacements: { branchId, startDate, endDate,  productName, userName, transactionId}, });
    const totalItems = countResult[0][0].total
    const totalPages = Math.ceil(totalItems / limit);
    const data = { totalItems, totalPages, currentPage: page, items: result[0], };
    return res.status(200).send({ status: "Successfully find inventory", data: data, });
  },
  changePassword: async (req, res) => {
    try {
      let { id, oldPassword, newPassword, newPasswordConfirm } = req.body;
      if (!oldPassword || !newPassword || !newPasswordConfirm) 
        return res.status(404).send({isError: true, message: "Please fill all the required fields"});
      const findUser = await admins.findByPk(id)
      if (!findUser)
        return res.status(404).send({isError: true, message: "User not found"})
      const isPasswordMatch = await bcrypt.compare(oldPassword, findUser.password)
      if (!isPasswordMatch)
        return res.status(404).send({isError: true, message: "Wrong old password"})
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(newPassword))
        return res.status(404).send({isError: true, message: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number"})
      if (newPasswordConfirm !== newPassword)
        return res.status(404).send({isError: true, message: "New password and confirm new password do not match"});
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      await admins.update({password: hashedNewPassword}, {where: {id: id}})
      res.status(200).send({isError: false, message: "Change password success"});
    } catch (error) {
      console.log(error);
      res.status(404).send({isError: true, message: "Change password failed"})}
  }
};