const router = require("express").Router()
const {addressController} = require('../controllers')
const auth = require('../middleware/auth')


router.get('/:id_user', auth, addressController.getUserAddress)

module.exports = router