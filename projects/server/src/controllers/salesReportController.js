const db = require("../models");

module.exports = {
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
};