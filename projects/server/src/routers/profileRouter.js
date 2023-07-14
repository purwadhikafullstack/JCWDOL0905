const router = require("express").Router()
const { profileController } = require('../controllers')
const auth = require('../middleware/auth')
const { multerUpload } = require('../middleware/multerProfile')


router.get('/:id', auth, profileController.getProfile)
router.patch('/:id', auth, multerUpload.single('file'), profileController.editProfile)
router.get('/admin/:token', auth, profileController.getAdminProfile)

module.exports = router