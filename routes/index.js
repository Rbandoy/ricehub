const express = require('express')
const router = express.Router()
const subscription = require('./subscription')

router.use('/subscriber', subscription)

module.exports = router
