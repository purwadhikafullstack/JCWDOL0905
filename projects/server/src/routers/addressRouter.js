const router = require("express").Router()
const {addressController} = require('../controllers')
const auth = require('../middleware/auth')


router.get('/user/:id_user', auth, addressController.getUserAddress)
router.get('/:id', auth, addressController.getAddressDetail)
router.post('/', auth, addressController.addNewAddress)
router.patch('/:id', auth, addressController.updateAddress)
router.delete('/:id', auth, addressController.deleteAddress)

module.exports = router