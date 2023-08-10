const express = require('express')
const lectureController = require('../controllers/lectures.controller')
const { lectureRules } = require('../middleware/validation-middleware')
/**
 * Router
 */
const router = express.Router()

router.get('/', lectureController.index)

router.post('/', lectureRules, lectureController.create)

router.get('/:id', lectureController.show)

router.patch('/', lectureRules, lectureController.update)

router.delete('/', lectureController.delete)

module.exports = router
