const express = require('express')
const dashboardController = require('../controllers/dashboard.controller')
/**
 * Router 
 */
let router = express.Router()

router.get('/', dashboardController.index);

router.post('/', dashboardController.create);

router.get('/:id', dashboardController.show);

router.patch('/', dashboardController.update);

router.delete("/", dashboardController.delete);

module.exports = router