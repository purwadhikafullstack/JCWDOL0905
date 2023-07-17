const db = require("../models");
const users = db.User;
const Transaction_Header = db.Transaction_Header;
const { Op } = require("sequelize");
const { Sequelize} = require('sequelize');

module.exports = {
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
};