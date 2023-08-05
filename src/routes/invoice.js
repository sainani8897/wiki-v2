const express = require('express')
const invoiceController = require('../controllers/invoice.controller')
const { invoiceRules } = require('../middleware/validation-middleware')
/**
 * Router
 */
const router = express.Router()

router.get('/', invoiceController.index)

router.post('/', invoiceRules, invoiceController.create)

router.get('/:id', invoiceController.show)

router.patch('/', invoiceRules, invoiceController.update)

router.delete('/', invoiceController.delete)

module.exports = router
