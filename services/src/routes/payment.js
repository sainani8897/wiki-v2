const express = require('express')
const paymentController = require('../controllers/payment.controller')
const { paymentRules } = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', paymentController.index);

router.post('/', paymentRules, paymentController.create);

router.get('/:id', paymentController.show);

router.patch('/', paymentRules, paymentController.update);

router.delete("/", paymentController.delete);

module.exports = router