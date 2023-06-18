const router = require("express").Router()
const {addressController} = require('../controllers')
const auth = require('../middleware/auth')


router.get('/user/:id_user', auth, addressController.getUserAddress)
router.get('/:id', auth, addressController.getAddressDetail)

module.exports = router