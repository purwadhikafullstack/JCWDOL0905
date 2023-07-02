const router = require("express").Router()
const { transactionController } = require('../controllers')
const auth = require('../middleware/auth')

router.get('/', auth, transactionController.getOrderList)
router.post('/', auth, transactionController.createOrder)

module.exports = router