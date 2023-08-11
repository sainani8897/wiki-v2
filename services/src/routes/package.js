const express = require('express')
const packageController = require('../controllers/package.controller')
const {packageRules} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', packageController.index);

router.post('/', packageRules, packageController.create);

router.get('/:id', packageController.show);

router.patch('/', packageRules,packageController.update);

router.delete("/", packageController.delete);

module.exports = router