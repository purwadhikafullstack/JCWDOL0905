const router = require("express").Router();
const { voucherController } = require("../controllers");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/", auth, authAdmin.verifyToken, voucherController.createVoucher);
router.get("/", auth, authAdmin.verifyToken, voucherController.getAllVouchers);
router.get('/user', auth, voucherController.getUserVoucher)
router.get('/claimable/:userId', auth, voucherController.getVoucherClaimable)
router.get('/claimed/:userId', auth, voucherController.getUsedVoucher)
router.post('/claim', auth, voucherController.postClaimVoucher)
module.exports = router;
