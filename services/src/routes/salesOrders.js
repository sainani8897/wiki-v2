const express = require('express')
const salesOrderController = require('../controllers/salesOrder.controller')
const {saleOrderRules} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', salesOrderController.index);

router.post('/', saleOrderRules, salesOrderController.create);

router.get('/:id', salesOrderController.show);

router.patch('/', saleOrderRules,salesOrderController.update);

router.delete("/", salesOrderController.delete);

module.exports = router