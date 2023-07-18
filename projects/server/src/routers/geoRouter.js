const router = require("express").Router()
const {geoController} = require('../controllers')
const auth = require('../middleware/auth')

router.get('/', auth, geoController.getLocation)

module.exports = router