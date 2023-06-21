const router = require("express").Router();
const { discountController } = require("../controllers");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/", auth, authAdmin.verifyToken, discountController.createDiscount);
router.get("/", auth, authAdmin.verifyToken, discountController.getAllDiscounts);

module.exports = router;
