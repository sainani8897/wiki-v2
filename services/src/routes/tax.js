const express = require('express')
const taxController = require('../controllers/tax.controller')
const {myTaxes} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', taxController.index);

router.post('/', myTaxes, taxController.create);

router.get('/:id', taxController.show);

router.patch('/', taxController.update);

router.delete("/", taxController.delete);

module.exports = router