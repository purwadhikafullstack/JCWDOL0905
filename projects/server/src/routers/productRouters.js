const router = require("express").Router();
const { productControllers } = require("../controllers");
const auth = require('../middleware/auth');
const authAdmin = require("../middleware/authAdmin");
const upload = require("../middleware/multer");


router.get("/", auth, productControllers.fetchAllProducts);
router.post("/", auth, authAdmin.verifyToken, upload("products"), productControllers.addProduct);
router.patch("/:id", auth, authAdmin.verifyToken, upload("products"), productControllers.updateProduct);
router.delete("/:id", auth, authAdmin.verifyToken, productControllers.deleteProduct);

module.exports = router;
