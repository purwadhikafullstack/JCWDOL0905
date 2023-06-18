const router = require("express").Router()
const {cartController} = require('../controllers')
const auth = require('../middleware/auth')

router.get('/', auth, cartController.getCart)
router.get('/count', auth, cartController.countCartItem)
router.post('/:idInventory', auth, cartController.addToCart)
router.delete('/', auth, cartController.deleteCart)

module.exports = router