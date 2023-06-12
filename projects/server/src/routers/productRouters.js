const router = require("express").Router();
const { productControllers } = require("../controllers");

router.post("/", productControllers.addProduct);
router.get("/", productControllers.fetchAllProducts);

module.exports = router;
