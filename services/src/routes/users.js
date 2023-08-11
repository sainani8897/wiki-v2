const express = require('express')
const userController = require('../controllers/user.controller')
const {userRules} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', userController.index);

router.post('/',userRules, userController.create);

router.patch('/',userRules, userController.update);

router.get('/:slug', userController.show);

module.exports = router