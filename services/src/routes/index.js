const express = require('express')
const Routes = express.Router()
const { authenticateToken } = require('../middleware/jwt-token-verification')

const validationMiddleware = require('../middleware/validation-middleware')

const users = require('./users')
const student = require('./student')

const authController = require('../controllers/auth.contoller')
const mediaManager = require('../routes/mediaManager')
const documents = require('./documents')
const roles = require('./roles')
const vendors = require('./vendor')
const { profile, changePassword } = require('../controllers/user.controller')
const permissions = require('../controllers/permissions.controller')
const category = require('./category')
const tax = require('./tax')
const invoice = require('./invoice')
const dashboard = require('./dashboard')
const organization = require('./organization')
const course = require('./course')
const sections = require('./sections')
const lectures = require('./lectures')
const batch = require('./batch')
/** Home Route */
Routes.get('/', function (req, res) {
  res.send('Home api page')
})

/** Login Route */
Routes.post('/login', validationMiddleware.login, authController.login)

/** Register Route */
Routes.post('/register', validationMiddleware.signup, authController.register)

/** Logout Route */
Routes.post('/logout', authenticateToken, authController.logout)

/* Refresh token  */
Routes.post('/refresh', authController.refreshToken)

/** Routes Users  */
Routes.use('/users', authenticateToken, users)

Routes.get('/profile', authenticateToken, profile)

/** Change Password */
Routes.patch(
  '/change-password',
  validationMiddleware.changePassword,
  authenticateToken,
  changePassword
)

/** Media Manager */
Routes.use('/media-manager', authenticateToken, mediaManager)

/** Documents */
Routes.use('/documents', authenticateToken, documents)

/** Role Routes */
Routes.use('/roles', authenticateToken, roles)

/** Permissions Routes */
Routes.get('/permissions', authenticateToken, permissions.index)

/** Student Routes */
Routes.use('/students', authenticateToken, student)

Routes.use('/vendors', authenticateToken, vendors)

/** Categories Routes */
Routes.use('/categories', authenticateToken, category)

/** Tax Routes */
Routes.use('/taxes', authenticateToken, tax)

/** Invoice Routes  */
Routes.use('/invoice', authenticateToken, invoice)

/* Dashboard Controller */
Routes.use('/dashboard', authenticateToken, dashboard)

/* Organization Controller */
Routes.use('/organization', authenticateToken, organization)

/* Course Controller */
Routes.use('/course', authenticateToken, course)

/* Sections Controller */
Routes.use('/sections', authenticateToken, sections)

/* Lecture Controller */
Routes.use('/lectures', authenticateToken, lectures)

/* Batch Controller */
Routes.use('/batch', authenticateToken, batch)

module.exports = Routes
