const express = require('express')
const router = express.Router()
const subscription = require('./subscription')
const merchant = require('./merchant/merchant')
const products = require('./products/products')
const auth = require('./auth.js')

router.use('/subscriber', subscription)
router.use('/merchant', merchant)
router.use('/products', products)
router.use('/auth', auth)

module.exports = router
