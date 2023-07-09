const userRouter = require("./userRouter");
const profileRouter = require("./profileRouter");
const addressRouter = require("./addressRouter");
const branchRouter = require("./branchRouter");
const suggestionRouter = require("./suggestionRouter");
const categoryRouters = require("./categoryRouters");
const productRouters = require("./productRouters");
const inventoryRouters = require("./inventoryRouters");
const adminRouter = require("./adminRouter");
const discountRouter = require("./discountRouter");
const voucherRouter = require("./voucherRouter")
const cartRouter = require("./cartRouter");
const cityRouter = require("./cityRouter")
const shippingRouter = require("./shippingRouter")
const transactionRouter = require("./transactionRouter")
const orderRouter = require("./orderRouter")

module.exports = {
    userRouter,
    profileRouter,
    addressRouter,
    branchRouter,
    suggestionRouter,
    categoryRouters,
    productRouters,
    inventoryRouters,
    cartRouter,
    adminRouter,
    discountRouter,
    voucherRouter,
    cityRouter,
    shippingRouter,
    transactionRouter,
    orderRouter,
}


