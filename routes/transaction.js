const express = require('express')
const router = express.Router()

const TransactionController = require('../controller/TransactionController')
const transaction = require('../middleware/Validator/TransactionValidator')

router.post('/', transaction.create(), TransactionController.create)
router.get('/', transaction.get(), TransactionController.get)

module.exports = router
