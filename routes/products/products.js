const express = require('express')
const router = express.Router()
const ProductsController = require('../../controller/products/ProductsController')

// GET
router.get('/', ProductsController.getActiveProducts)

// POST

// UPDATE

module.exports = router
