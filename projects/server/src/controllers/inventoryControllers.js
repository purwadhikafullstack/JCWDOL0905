const db = require("../models");
const inventory = db.Inventory;
const product = db.Product;
const discount = db.Discount;
const { Op } = require("sequelize");
const { literal } = require('sequelize');

module.exports = {
  addInventory: async (req, res) => {
    try {
      const { id_product, id_branch, stock } = req.body;

      if (!id_product || !id_branch || !stock) {
        return res.status(400).send({
          isError: true,
          message: "Please complete your data",
        });
      }

      const newInventory = await inventory.create(req.body);

      res.status(200).send({
        isError: false,
        message: "Successfully add a product to store branch",
        data: newInventory,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Error adding a product to store branch",
      });
    }
  },
  fetchAllInventories: async (req, res) => {
    try {
    const branchId = req.query.branchId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;

    const category_id = parseInt(req.query.category) || null;
    const productName = req.query.name || null;
    const sort = req.query.sort || "ASC";
    const order = req.query.order === "product_price" ? 'discounted_price' : "`Product.product_name`";

    const categoryQuery = category_id ? { id_category: category_id } : {};
    const productQuery = productName ? { product_name: { [Op.like]: `%${productName}%` } } : {};

      
    const allInventories = await inventory.findAndCountAll({
      where: {
        id_branch: branchId,
        stock: {
          [Op.gte]: 1,
        }
      },
      include: [
        {
          model: product,
          where: { ...categoryQuery, ...productQuery },
        },
        {
          model: discount,
          where: {
            end_date: {
              [Op.gte]: new Date(),
            },
          },
          required: false,
        },
      ],
      attributes: {
        include: [
          [
            literal("`Product`.`product_price` -  IFNULL((select case when d.discount_type =  'percentage' then `Product`.`product_price` *  d.discount_value * 0.01 when d.discount_type =  'amount' then  d.discount_value when d.discount_type = 'buy one get one' then 0 end as discount from discounts d where d.id_inventory = `Inventory`.`id` and end_date >= CURDATE() limit 1),0)"),
            'discounted_price',
          ],
        ],
      },
      order: [[literal(order), sort]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    res.status(200).send({
      isError: false,
      message: "Successfully fetch inventories",
      data: allInventories.rows,
      count: allInventories.count,
    });


    } catch (err) {
      console.log(err);
      res.status(400).send({
        isError: true,
        message: "Fetch inventories failed",
      });
    }
  },
  findInventory: async (req, res) => {
    const inventoryId = req.params.idInventory;
    try {
        let findInventory = await inventory.findOne({ where: { id: inventoryId } });
        if (!findInventory){
            return res.status(404).send({ isError: true, message: "Inventory not exist", navigate: true });
        }
        
        res.status(200).send({
            status: "Successfully find inventory",
            data: findInventory,
            navigate: false
        });

    } catch (error) {
        console.log(error);
        res.status(404).send({isError: true, message: "Find inventory failed"})
    }
},
  getInventoryById: async (req, res) => {
    const id = req.params.id;
    try {
      const inventoryData = await inventory.findOne({
        where: {
          id: id,
          stock: {
            [Op.gte]: 1,
          }
        },
        include: [{
          model: product
        },
        {
          model: discount,
          where: {
            end_date: {
              [Op.gte]: new Date(),
            }
          },
          required: false,
        }
      ],
      attributes: {
        include: [
          [
            literal("`Product`.`product_price` -  IFNULL((select case when d.discount_type =  'percentage' then `Product`.`product_price` *  d.discount_value * 0.01 when d.discount_type =  'amount' then  d.discount_value when d.discount_type = 'buy one get one' then 0 end as discount from discounts d where d.id_inventory = `Inventory`.`id` and end_date >= CURDATE() limit 1),0)"),
            'discounted_price',
          ],
        ],
      },
      })

      if (!inventoryData) {
        return res.status(404).send({ isError: true, message: "Inventory not exist", navigate: true})
      }
    
      res.status(200).send({
        isError: false,
        message: "Successfully fetch inventory by id",
        data: inventoryData,
      });

    } catch (error) {
      console.log(error);
      res.status(404).send({isError: true, message: "Fetch inventory by Id failed"})
    }
  }
};
