const express = require('express')
const courseController = require('../controllers/course.controller')
const { courseRules } = require('../middleware/validation-middleware')
/**
 * Router
 */
const router = express.Router()

router.get('/', courseController.index)

router.post('/', courseRules, courseController.create)

router.get('/:id', courseController.show)

router.patch('/', courseRules, courseController.update)

router.delete('/', courseController.delete)

module.exports = router
