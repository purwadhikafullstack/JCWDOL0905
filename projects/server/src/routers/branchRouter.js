const router = require("express").Router()
const {branchController} = require('../controllers')
const auth = require('../middleware/auth')


router.get('/', auth, branchController.getBranch)

module.exports = router