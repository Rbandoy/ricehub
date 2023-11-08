const express = require('express')
const router = express.Router()
const ProductsController = require('../../controller/products/ProductsController')
const auth = require('../../controller/authentication/auth')
// GET
router.get('/', auth.verify, ProductsController.getActiveProducts)

// POST

// UPDATE

module.exports = router
