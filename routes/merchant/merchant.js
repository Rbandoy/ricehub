const express = require('express')
const router = express.Router()
const MerchantController = require('../../controller/merchant/MerchantController')

// GET
router.get('/productByBatchId', MerchantController.getProductByBatchNo)
router.get('/products', MerchantController.getProducts)

// POST
router.post('/postProduct', MerchantController.postProduct)

// UPDATE
module.exports = router
