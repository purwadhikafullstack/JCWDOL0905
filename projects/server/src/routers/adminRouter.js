const router = require("express").Router()
const { adminController, dashboardController, salesReportController } = require('../controllers')
const auth = require('../middleware/auth')

router.post('/create-admin', auth, adminController.createNewAdmin)
router.put('/edit-admin/:id', auth, adminController.editAdmin)
router.get('/branch-admin-list', auth, adminController.getBranchAdmin)
router.post('/login', auth, adminController.login)
router.get("/auth", auth, adminController.getAdminByToken)
router.delete("/delete-admin/:id", auth, adminController.deleteAdmin)
router.get('/dashboard-data', auth, dashboardController.getDashboardData)
router.get('/dashboard-data-branch/', auth, dashboardController.getDashboardDataPerBranch)
router.get('/sales-report',auth, salesReportController.getSalesReport)
router.post("/change-password", auth, adminController.changePassword);

module.exports = router