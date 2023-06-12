const router = require("express").Router();
const { inventoryControllers } = require("../controllers");
const auth = require('../middleware/auth')


router.post("/", auth, inventoryControllers.addInventory);
router.get("/", auth, inventoryControllers.fetchAllInventories);

module.exports = router;
