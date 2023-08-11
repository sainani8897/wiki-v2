const express = require('express')
const billsController = require('../controllers/bills.controller')
const {billRules} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', billsController.index);

router.post('/', billRules, billsController.create);

router.get('/:id', billsController.show);

router.patch('/', billRules,billsController.update);

router.delete("/", billsController.delete);

module.exports = router