const router = require("express").Router();
const { inventoryControllers } = require("../controllers");
const auth = require('../middleware/auth')


router.post("/", auth, inventoryControllers.addInventory);
router.get("/", auth, inventoryControllers.fetchAllInventories);
router.get("/find/:idInventory", auth, inventoryControllers.findInventory);

module.exports = router;
