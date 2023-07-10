const router = require("express").Router()
const { profileController } = require('../controllers')
const auth = require('../middleware/auth')
const { multerUpload } = require('../middleware/multerProfile')


router.get('/voucher/:id_user', auth, profileController.checkReferral)
router.get('/:id', auth, profileController.getProfile)
router.post('/voucher/:id_user', auth, profileController.claimReferralVoucher)
router.patch('/:id', auth, multerUpload.single('file'), profileController.editProfile)

module.exports = router