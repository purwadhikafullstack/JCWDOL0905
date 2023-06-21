const router = require("express").Router()
const { adminController } = require('../controllers')
const auth = require('../middleware/auth')

router.post('/create-admin', auth, adminController.createNewAdmin)
router.post('/login', auth, adminController.login)
router.get("/auth/:token", auth, adminController.getAdminByToken)

module.exports = router
