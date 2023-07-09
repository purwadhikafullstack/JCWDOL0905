const router = require("express").Router()
const { orderController } = require('../controllers')
const auth = require('../middleware/auth')
const { multerUpload } = require('../middleware/multerPayment')

router.patch('/cancel/:id', auth, orderController.cancelOrder)
router.patch('/upload/:id', auth, multerUpload.single('file'), orderController.uploadPayment)

module.exports = router