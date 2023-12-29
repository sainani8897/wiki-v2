const express = require('express')
const studentController = require('../controllers/student.controller')
const { myCustomers } = require('../middleware/validation-middleware')
/**
 * Router
 */
const router = express.Router()

router.get('/', studentController.index)

router.post('/', myCustomers, studentController.create)

router.get('/:id', studentController.show)

router.patch('/', studentController.update)

router.delete('/', studentController.delete)

module.exports = router
