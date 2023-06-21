const router = require("express").Router();
const { voucherController } = require("../controllers");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/", auth, authAdmin.verifyToken, voucherController.createVoucher);
router.get("/", auth, authAdmin.verifyToken, voucherController.getAllVouchers);

module.exports = router;
