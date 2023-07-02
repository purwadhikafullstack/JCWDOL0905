const router = require("express").Router()
const {cityController} = require('../controllers')
const auth = require('../middleware/auth')


router.get('/', auth, cityController.getCity)
router.get('/:id', auth, cityController.getCityById)

module.exports = router