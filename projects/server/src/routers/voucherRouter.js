const router = require("express").Router()
const {voucherController} = require('../controllers')
const auth = require('../middleware/auth')

router.get('/user', auth, voucherController.getUserVoucher)

module.exports = router