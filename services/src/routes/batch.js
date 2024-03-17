const express = require('express')
const BatchController = require('../controllers/batch.controller')
const { batchRules } = require('../middleware/validation-middleware')
/**
 * Router
 */
const router = express.Router()

router.get('/', BatchController.index)

router.post('/', batchRules, BatchController.create)

router.get('/:id', BatchController.show)

router.patch('/', batchRules, BatchController.update)

router.delete('/', BatchController.delete)

module.exports = router
