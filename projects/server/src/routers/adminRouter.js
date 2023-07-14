const router = require("express").Router()
const { adminController } = require('../controllers')
const auth = require('../middleware/auth')

router.post('/create-admin', auth, adminController.createNewAdmin)
router.put('/edit-admin/:id', auth, adminController.editAdmin)
router.get('/branch-admin-list', auth, adminController.getBranchAdmin)
router.post('/login', auth, adminController.login)
router.get("/auth/:token", auth, adminController.getAdminByToken)
router.delete("/delete-admin/:id", auth, adminController.deleteAdmin)
router.get('/dashboard-data', auth, adminController.getDashboardData)
router.get('/dashboard-data-branch/', auth, adminController.getDashboardDataPerBranch)
router.get('/sales-report',auth, adminController.getSalesReport)
router.post("/change-password", auth, adminController.changePassword);

module.exports = router