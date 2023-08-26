require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('./api-helpers/logger/logger')
const { apiResponse } = require('./api-helpers/v1/message/ResponseController')
const isEmpty = require('./api-helpers/lib/isEmpty')
const app = express()
const routes = require('./routes/index')
const rTracer = require('cls-rtracer')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  rTracer.expressMiddleware({
    requestIdFactory: (req) => {
      const sessionId = (Math.random() + 1).toString(36).substring(6)
      const subscriber_id = req.query.subscriber_id
      return { sessionId, subscriber_id }
    },
  })
)
app.use('/ers/api/v1', routes)

app.use((req, res) => {
  res.status(404).send('Resource not found')
})

app.use((err, req, res, next) => {
  if (err.statusCode && err.statusCode !== 500) {
    logger.error(err)
    return res
      .status(err.statusCode)
      .json(apiResponse({ isSuccess: false, errors: err }))
  }

  res
    .status(500)
    .json(apiResponse({ isSuccess: false, errors: 'Internal Server Error' }))
})

app.listen(process.env.PORT, () => {
  logger.info(`server running on port :${process.env.PORT}`)
})
