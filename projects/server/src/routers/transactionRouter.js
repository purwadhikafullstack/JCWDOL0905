const router = require("express").Router()
const { transactionController } = require('../controllers')
const auth = require('../middleware/auth')

router.get('/', auth, transactionController.getOrderList)
router.get('/item/:id', auth, transactionController.getItem)
router.get('/:id', auth, transactionController.getOrderDetail)
router.post('/', auth, transactionController.createOrder)

module.exports = router