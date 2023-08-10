const express = require('express')
const sectionsController = require('../controllers/sections.controller')
const { sectionsRules } = require('../middleware/validation-middleware')
/**
 * Router
 */
const router = express.Router()

router.get('/', sectionsController.index)

router.post('/', sectionsRules, sectionsController.create)

router.get('/:id', sectionsController.show)

router.patch('/', sectionsRules, sectionsController.update)

router.delete('/', sectionsController.delete)

module.exports = router
