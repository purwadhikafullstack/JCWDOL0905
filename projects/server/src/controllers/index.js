const userController = require('./userController')
const profileController = require('./profileController')
const addressController = require('./addressController')
const branchController = require('./branchController')
const suggestionController = require('./suggestionController')
const categoryControllers = require("./categoryControllers");
const productControllers = require("./productControllers");
const inventoryControllers = require("./inventoryControllers");
const adminController = require("./adminController")
const cartController = require("./cartController")
const discountController = require("./discountController")
const voucherController = require("./voucherController")
const cityController = require("./cityController")
const shippingController = require("./shippingController")
const transactionController = require("./transactionController")
const orderController = require("./orderController")

module.exports = {
    userController,
    profileController,
    addressController,
    branchController,
    suggestionController,
    categoryControllers,
    productControllers,
    inventoryControllers,
    adminController,
    cartController,
    discountController,
    voucherController,
    cityController,
    shippingController,
    transactionController,
    orderController,
}