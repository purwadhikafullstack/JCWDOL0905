const router = require("express").Router()
const {cartController} = require('../controllers')
const auth = require('../middleware/auth')

router.get('/', auth, cartController.getCart)
router.get('/count', auth, cartController.countCartItem)
router.post('/:idInventory', auth, cartController.addToCart)
router.patch('/bonus/:id', auth, cartController.updateBonus)
router.patch('/:id', auth, cartController.updateQty)
router.delete('/', auth, cartController.deleteCart)
router.delete('/:id', auth, cartController.deleteCartItem)

module.exports = router