const express = require('express')
const router = express.Router()
const ProductsController = require('../../controller/products/ProductsController')
const auth = require('../../controller/authentication/auth')
// GET
router.get('/', ProductsController.getActiveProducts)
router.get('/:id', ProductsController.getActiveProductsById)

// POST

// UPDATE

module.exports = router
