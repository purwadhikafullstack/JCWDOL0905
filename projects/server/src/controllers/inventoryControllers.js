const db = require("../models");
const inventory = db.Inventory;
const product = db.Product;
const inventoryHistory = db.Inventory_History;
const discount = db.Discount;
const category = db.Category;
const storeBranch = db.Store_Branches;
const { Op } = require("sequelize");
const { literal } = require('sequelize');

module.exports = {
  fetchAllInventories: async (req, res) => {
    try {
    const branchId = req.query.branchId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;
    const category_id = parseInt(req.query.category) || null;
    const productName = req.query.name || null;
    const sort = req.query.sort || "ASC";
    const order = req.query.order === "product_price" ? 'discounted_price' : "`Product.product_name`";
    const admin = req.query.adm || null;
    const categoryQuery = category_id ? { id_category: category_id } : {};
    const productQuery = productName ? { product_name: { [Op.like]: `%${productName}%` } } : {};
    const stockQuery = !admin ? {stock: { [Op.gte]: 1} } : {};
    const allInventories = await inventory.findAndCountAll({
      where: {
        id_branch: branchId,
        ...stockQuery
      },
      include: [
        {
          model: product,
          where: { ...categoryQuery, ...productQuery },
          include: { model: category, attributes: ['category_name'] },
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
            literal("`Product`.`product_price` -  IFNULL((select case when d.discount_type =  'percentage' then `Product`.`product_price` *  d.discount_value * 0.01 when d.discount_type =  'amount' then  d.discount_value when d.discount_type = 'buy one get one' then 0 end as discount from Discounts d where d.id_inventory = `Inventory`.`id` and end_date >= CURDATE() and start_date <= CURDATE() limit 1),0)"),
            'discounted_price',
          ],
        ],
      },
      order: [[literal(order), sort]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    res.status(200).send({ isError: false, message: "Successfully fetch inventories", data: allInventories.rows, count: allInventories.count , });
    } catch (err) {
      console.log(err);
      res.status(400).send({ isError: true, message: "Fetch inventories failed", });
    }
  },
  findInventory: async (req, res) => {
    const branchId = req.query.branchId
    const inventoryId = req.params.idInventory;
    try {
        let findInventory = await inventory.findOne({ where: { id: inventoryId } });
        if (!findInventory){
          return res.status(404).send({ isError: true, message: "Inventory not exist", navigate: true });
        }else if(findInventory.id_branch!=branchId){
          return res.status(404).send({ isError: true, message: "Id branch not valid", navigate: true });
        }
        res.status(200).send({ status: "Successfully find inventory", data: findInventory, navigate: false });
    } catch (error) {
      console.log(error);
      res.status(404).send({ isError: true, message: "Find inventory failed" });
    }
  },
  findInventoryHistory: async (req, res) => {
    let { productName, orderBy, orderByMethod, branchId, startDate, endDate, page, limit, } = req.query;
    const mapOrderBy = { id: "Inventory_Histories.id", productName: "CombinedQuery.productName", createdAt: "Inventory_Histories.createdAt", };
    productName = productName ? `%${productName}%` : "";
    orderBy = mapOrderBy[orderBy] || "Inventory_Histories.id";
    orderByMethod = orderByMethod || "ASC";
    branchId = branchId || "";
    startDate = startDate || "1970-01-01 00:00:00";
    endDate = endDate || "9999-12-31 23:59:59";
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    const query = `
    SELECT
        Inventory_Histories.id,
        CombinedQuery.productName,
        CombinedQuery.branchName,
        Inventory_Histories.status,
        Inventory_Histories.reference,
        Inventory_Histories.quantity,
        Inventory_Histories.createdAt,
        Inventory_Histories.updatedAt,
        Inventory_Histories.current_stock
    FROM
        (
            SELECT
                Inventories.id,
                Inventories.stock AS inventory_stock,
                Products.product_name AS productName,
                Store_Branches.branch_name AS branchName
            FROM
                Inventories
            JOIN
                Products ON Inventories.id_product = Products.id
            JOIN 
                Store_Branches ON Inventories.id_branch = Store_Branches.id            
            WHERE
                ${branchId ? "Inventories.id_branch = :branchId" : "1 = 1"}
        ) AS CombinedQuery
    JOIN
        Inventory_Histories ON Inventory_Histories.id_inventory = CombinedQuery.id
    WHERE
        ${productName ? "CombinedQuery.productName LIKE :productName" : "1 = 1"}
        AND Inventory_Histories.createdAt BETWEEN :startDate AND :endDate
    ORDER BY
        ${orderBy} ${orderByMethod}
        LIMIT :limit
        OFFSET :offset;
  `;
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM
        (
            SELECT
                Inventories.id,
                Products.product_name AS productName
            FROM
                Inventories
            JOIN
                Products ON Inventories.id_product = Products.id
            WHERE
                ${branchId ? "Inventories.id_branch = :branchId" : "1 = 1"}
        ) AS CombinedQuery
    JOIN
        Inventory_Histories ON Inventory_Histories.id_inventory = CombinedQuery.id
    WHERE
        ${productName ? "CombinedQuery.productName LIKE :productName" : "1 = 1"}
        AND Inventory_Histories.createdAt BETWEEN :startDate AND :endDate;
  `;
    const result = await db.sequelize.query(query, { replacements: { branchId, productName, startDate, endDate, limit, offset, }, });
    const countResult = await db.sequelize.query(countQuery, { replacements: { branchId, productName, startDate, endDate, }, });
    const totalItems = countResult[0][0].total;
    const totalPages = Math.ceil(totalItems / limit);
    const data = { totalItems, totalPages, currentPage: page, items: result[0], };
    return res.status(200).send({ status: "Successfully find invesssntory", data: data, });
  },
  getInventoryById: async (req, res) => {
    const id = req.params.id;
    try {
      const inventoryData = await inventory.findOne({
        where: { id: id, stock: { [Op.gte]: 1, } },
        include: [{ model: product }, { model: discount, where: { end_date: { [Op.gte]: new Date(), } }, required: false, } ],
      attributes: {
        include: [
          [
            literal("`Product`.`product_price` -  IFNULL((select case when d.discount_type =  'percentage' then `Product`.`product_price` *  d.discount_value * 0.01 when d.discount_type =  'amount' then  d.discount_value when d.discount_type = 'buy one get one' then 0 end as discount from Discounts d where d.id_inventory = `Inventory`.`id` and end_date >= CURDATE() and start_date <= CURDATE() limit 1),0)"),
            'discounted_price',
          ],
        ],
      },
      })
      if (!inventoryData) { return res.status(404).send({ isError: true, message: "Inventory not exist", navigate: true}) }
      res.status(200).send({ isError: false, message: "Successfully fetch inventory by id", data: inventoryData, });
    } catch (error) {
      console.log(error);
      res.status(404).send({isError: true, message: "Fetch inventory by Id failed"})
    }
  },
  updateStock: async (req, res) => {
    const id = req.params.id;
    try {
      const { stock, status, quantity } = req.body;
      const inventoryData = await inventory.findOne({
        where: {id : id}
      })
      if (!inventoryData) { return res.status(404).send({ isError: true, message: "Inventory not exist", navigate: true}) }
      if (status === 'out' && inventoryData.stock < quantity) { return res.status(404).send({ isError: true, message: "Can't reduce quantity more than available stock", navigate: true}) }
      const data = await inventory.update({
        stock: stock
      },{
        where: {id: id},
      })
      const result = await inventoryHistory.create({ status: status, reference: 'manual', quantity: quantity, id_inventory: id, current_stock: stock })
      res.status(200).send({ isError: false, message: "Successfully update stock", data: result });
    } catch (error) {
      res.status(404).send({isError: true, message: "Update stock failed"})
    }
  }
};
