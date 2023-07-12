const router = require("express").Router()
const { orderController } = require('../controllers')
const auth = require('../middleware/auth')
const { multerUpload } = require('../middleware/multerPayment')

router.patch('/cancel/:id', auth, orderController.cancelOrder)
router.patch('/upload/:id', auth, multerUpload.single('file'), orderController.uploadPayment)
router.patch('/accept/:id', auth, orderController.acceptPayment)
router.patch('/reject/:id', auth, orderController.rejectPayment)
router.patch('/ship/:id', auth, orderController.shipOrder)
router.patch('/receive/:id', auth, orderController.receiveOrder)

module.exports = router