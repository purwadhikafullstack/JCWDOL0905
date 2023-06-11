const router = require("express").Router()
const {suggestionController} = require('../controllers')
const auth = require('../middleware/auth')


router.get('/:id_branch', auth, suggestionController.getSuggestedProduct)

module.exports = router