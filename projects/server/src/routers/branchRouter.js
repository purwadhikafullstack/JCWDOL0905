const router = require("express").Router()
const {branchController} = require('../controllers')
const auth = require('../middleware/auth')

router.get('/', auth, branchController.getBranch)
router.get('/filter', auth, branchController.getBranchWithFilter)
router.get('/:id', auth, branchController.getBranchDetail)
router.post('/create-branch', auth, branchController.createBranch)
router.put('/edit-branch/:id', auth, branchController.editBranch)
router.delete('/delete-branch/:id', auth, branchController.deleteBranch)

module.exports = router