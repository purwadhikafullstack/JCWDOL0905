const userController = require('./userController')

const profileController = require('./profileController')
const addressController = require('./addressController')
const branchController = require('./branchController')
const suggestionController = require('./suggestionController')
const categoryControllers = require("./categoryControllers");
const productControllers = require("./productControllers");
const inventoryControllers = require("./inventoryControllers");

module.exports = {
    userController,
    profileController,
    addressController,
    branchController,
    suggestionController,
  categoryControllers,
  productControllers,
  inventoryControllers,
}
  



