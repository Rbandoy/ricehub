const express = require('express')
const router = express.Router()
const subscription = require('./subscription')
const transaction = require('./transaction')

router.use('/subscriber', subscription)
router.use('/transaction', transaction)

module.exports = router
