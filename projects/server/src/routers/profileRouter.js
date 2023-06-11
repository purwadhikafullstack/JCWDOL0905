const router = require("express").Router()
const {profileController } = require('../controllers')
const auth = require('../middleware/auth')


router.get('/:id', auth, profileController.getProfile)
router.patch('/:id', auth, profileController.editProfile)

module.exports = router