const express = require('express')
const orgController = require('../controllers/organization.controller')
const {myTaxes} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', orgController.index);

router.post('/', myTaxes, orgController.create);

router.get('/:id', orgController.show);

router.patch('/', orgController.update);

router.delete("/", orgController.delete);

module.exports = router