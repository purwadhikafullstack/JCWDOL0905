const router = require("express").Router();
const { categoryControllers } = require("../controllers");
const auth = require('../middleware/auth')


router.post("/", auth, categoryControllers.createNewCategory);
router.get("/", auth, categoryControllers.fetchAllCategories);

module.exports = router;
