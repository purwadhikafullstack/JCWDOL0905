const userController = require('./userController')

const profileController = require('./profileController')
const addressController = require('./addressController')
const branchController = require('./branchController')
const suggestionController = require('./suggestionController')
const categoryControllers = require("./categoryControllers");
const productControllers = require("./productControllers");
const inventoryControllers = require("./inventoryControllers");
const cartController = require("./cartController")
const cityController = require("./cityController")
const shippingController = require("./shippingController")
const transactionController = require("./transactionController")
const voucherController = require("./voucherController")

module.exports = {
    userController,
    profileController,
    addressController,
    branchController,
    suggestionController,
    categoryControllers,
    productControllers,
    inventoryControllers,
    cartController,
    cityController,
    shippingController,
    transactionController,
    voucherController,
}
  



