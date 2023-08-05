const express = require('express')
const { port } = require('./config/config')
const app = express()
const routes = require('./routes')
const { connectDb } = require('./config/database')
const cors = require('cors')
const path = require('path')
const { main } = require('./schedulars')

/** CROS */
app.use(cors({
  origin: ['http://localhost:7000'],
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200
}))

/** Body Parser */
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/** Initializing Static  files */
app.use('/public', express.static(path.join(__dirname, 'public')))

/** Initializing the routes here */
app.use('/api/v1', routes)

/** Initializing the schedulers */
main().then(() => {
  console.log('Redis Schedular!')
})

/** global error handler */
app.use(function (err, req, res, next) {
  /** Our Custom Exceptions Handled Here! */
  if (err.status) {
    return res
      .status(err.status)
      .send({ status: err.status, message: err.message, error: err.error })
  }
  /** Default exception is caught here */
  return res
    .status(500)
    .send({ status: 500, message: err.message, error: err })
})

// app.use(function errorHandler (err, req, res, next) {
//   res.status(500)
//   res.send('error', { error: err })
// })

/**
 * Server Starting at Port
 *
 */
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Started Running at http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('Could not Able to connect to DB! Server not Started!', err)
  })
