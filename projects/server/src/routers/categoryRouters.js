const router = require("express").Router();
const { categoryControllers } = require("../controllers");
const auth = require('../middleware/auth');
const authAdmin = require("../middleware/authAdmin");
const upload = require("../middleware/multer");


router.post("/", auth, authAdmin.verifyToken, upload("categories"), categoryControllers.createNewCategory);
router.get("/", auth, categoryControllers.fetchAllCategories);
router.patch("/:id", auth, authAdmin.verifyToken, upload("categories"), categoryControllers.updateCategory)
router.delete("/:id", auth,authAdmin.verifyToken, categoryControllers.deleteCategory)
router.get("/find/:id", auth, categoryControllers.findCategory)

module.exports = router;
