const userRouter = require('./userRouter')
const profileRouter = require('./profileRouter')
const addressRouter = require('./addressRouter')
const branchRouter = require('./branchRouter')
const suggestionRouter = require('./suggestionRouter')
const categoryRouters = require("./categoryRouters");
const productRouters = require("./productRouters");
const inventoryRouters = require("./inventoryRouters");
const cartRouter = require("./cartRouter")
const adminRouter = require("./adminRouter")

module.exports = {
  userRouter,
  profileRouter,
  addressRouter,
  branchRouter,
  suggestionRouter,
  categoryRouters,
  productRouters,
  inventoryRouters,
  adminRouter,
  cartRouter,
}