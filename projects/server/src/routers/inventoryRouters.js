const router = require("express").Router();
const { inventoryControllers } = require("../controllers");
const auth = require('../middleware/auth')


router.post("/", auth, inventoryControllers.addInventory);
router.get("/", auth, inventoryControllers.fetchAllInventories);
router.get("/:id", auth, inventoryControllers.getInventoryById);
router.get("/find/:idInventory", auth, inventoryControllers.findInventory);
router.patch("/:id", auth, inventoryControllers.updateStock);
router.get("/admin/history", auth, inventoryControllers.findInventoryHistory)

module.exports = router;
