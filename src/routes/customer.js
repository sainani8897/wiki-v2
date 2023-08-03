const express = require('express')
const customerController = require('../controllers/customer.controller')
const {myCustomers} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', customerController.index);

router.post('/', myCustomers, customerController.create);

router.get('/:id', customerController.show);

router.patch('/', customerController.update);

router.delete("/", customerController.delete);

module.exports = router