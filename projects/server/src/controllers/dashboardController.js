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
    try {
      const totalUser = await users.count();

      const totalTransactions = await Transaction_Header.count({ where: { id_branch: id,createdAt: {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      }, order_status: { [Op.or]: ["done", "shipped"] } }, });
  
      const totalSales = await Transaction_Header.sum("final_price", { where: { id_branch: id,createdAt: {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      }, order_status: { [Op.or]: ["done", "shipped"] } }, });
  
      const totalSalesResult = await Transaction_Header.findAll({ attributes: [ [Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m')"), "name"], [Sequelize.fn("SUM", Sequelize.col("final_price")), "totalSales"], ], where: {id_branch: id, order_status: { [Op.or]: ["done", "shipped"] },
      createdAt: {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      },
    }, group: [Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m')")], order: [[Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m')"), "ASC"]], });
  
      let maxMonthlySales = 0;
      for (const monthSales of totalSalesResult) {
        if (Number(monthSales.totalSales) > maxMonthlySales) {
          maxMonthlySales = Number(monthSales.totalSales);
        }
      }
      const data = { totalUser, totalTransactions: totalTransactions, totalSales: totalSales, totalSalesResult: totalSalesResult, maxMonthlySales, };
      res.status(202) .send({ message: `Success delete admin data with id = ${id}`, data: data, });
    } catch (error) {
      res.status(400).send({ message: "error while request dashboard data" });
    }
  },
};