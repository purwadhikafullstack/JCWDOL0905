const db = require("../models");
const branch = db.Store_Branch;
const axios = require("axios")
const { Op } = require("sequelize");

module.exports = {
  getBranch: async (req, res) => {
    try {
      const branchData = await branch.findAll();
      if (!branchData) {
        return res
          .status(400)
          .send({ code: 400, message: `Cant't get branch data` });
      }
      res
        .status(200)
        .send({
          code: 200,
          message: "Get branch data success",
          data: branchData,
        });
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .send({ isError: true, message: "Get branch data failed" });
    }
  },

  getBranchDetail: async (req, res) => {
    try {
      const branchData = await branch.findOne({ where: { id: req.params.id } });
      if (!branchData) {
        return res
          .status(400)
          .send({ code: 400, message: `Can't get branch detail` });
      }
      res
        .status(200)
        .send({
          code: 200,
          message: "Get branch detail success",
          data: branchData,
        });
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .send({ isError: true, message: "Get branch detail failed" });
    }
  },
  getBranchWithFilter: async (req, res) => {
    try {
      let { page, limit, branchName, cityName, provinceName } = req.query;
      page = parseInt(page) || 1; // Default to 1 if not provided or invalid
      limit = parseInt(limit) || 5; // Default to 10 if not provided or invalid
      const offset = (page - 1) * limit;
      let whereCondition = {}
      if (branchName) {
        whereCondition.branch_name = { [Op.like]: `%${branchName}%` };
      }
      if (cityName) {
        whereCondition.city = { [Op.like]: `%${cityName}%` };
      }
      if (provinceName) {
        whereCondition.province = { [Op.like]: `%${provinceName}%` };
      }

      const branchData = await branch.findAndCountAll({where: whereCondition, limit: limit, offset: offset});
      const { count, rows } = branchData;
      const totalPages = Math.ceil(count / Number(limit));
      const data = {
        totalItems: count,
        totalPages: totalPages,
        items: rows
      }
      if (!branchData) {
        return res
          .status(400)
          .send({ code: 400, message: `Cant't get branch data` });
      }
      res
        .status(200)
        .send({
          code: 200,
          message: "Get branch data success",
          data: data,
        });
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .send({ isError: true, message: "Get branch data failed" });
    }
  },
  createBranch: async (req, res) => {
    try {
      let { branch_name, address, city, province } = req.body;
      if (!branch_name || !address || !city || !province)
        return res
          .status(404)
          .send({
            isError: true,
            message: "Please fill all the required fields",
          });

      const [cityId, cityName] = city.split("-");
      const [provinceId, provinceName] = province.split("-");

      let responseOpenCage = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=${process.env.KEY_OPENCAGE_API}&pretty=1&q=${address}, ${cityName}, ${provinceName}`)
      let longitude = responseOpenCage.data.results[0].geometry.lng
      let latitude = responseOpenCage.data.results[0].geometry.lat

      const result = await branch.create({
        branch_name: branch_name,
        address: address,
        city: cityName,
        province: provinceName,
        city_id: cityId,
        province_id: provinceId,
        latitude: latitude,
        longitude: longitude
      });
      res
        .status(201)
        .send({
          isError: false,
          message: "New store branch has been created successfully",
          data: result,
        });
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .send({ isError: true, message: "Failed to create store branch" });
    }
  },
  editBranch: async (req, res) => {
    try {
        let { branch_name, address, city, province } = req.body;
        const { id } = req.params;
        if (!branch_name || !address || !city || !province)
          return res
            .status(404)
            .send({
              isError: true,
              message: "Please fill all the required fields",
            });
  
        const [cityId, cityName] = city.split("-");
        const [provinceId, provinceName] = province.split("-");

        let responseOpenCage = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=${process.env.KEY_OPENCAGE_API}&pretty=1&q=${address}, ${cityName}, ${provinceName}`)
        let longitude = responseOpenCage.data.results[0].geometry.lng
        let latitude = responseOpenCage.data.results[0].geometry.lat
  
        const result = await branch.update({
          branch_name: branch_name,
          address: address,
          city: cityName,
          province: provinceName,
          city_id: cityId,
          province_id: provinceId,
          latitude: latitude,
          longitude: longitude
        }, { where: { id: id } });
        res
          .status(201)
          .send({
            isError: false,
            message: "Store branch has been edited successfully",
            data: result,
          });
      } catch (error) {
        console.log(error);
        res
          .status(404)
          .send({ isError: true, message: "Failed to store branch" });
      }
  },
  deleteBranch: async (req, res) => {
    try {
      const { id } = req.params;
      let resultBranch = await branch.findOne({ where: { id: id } });
      if (!resultBranch) {
        return res.status(404).send({ isError: true, message: "branch not found" });
      }
      const result = await branch.destroy({ where: { id: id } });
      res.status(202) .send({ message: `Success delete branch data with id = ${id}`, data: result, });
    } catch (error) {
      res.status(400).send({ message: "Error while request delete" });
    }
  }
};
