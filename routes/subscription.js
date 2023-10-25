const express = require('express')
const router = express.Router()
const auth = require('../controller/authentication/auth')
const SubscriberController = require('../controller/SubscriberController')
const subscription = require('../middleware/Validator/SubscriberValidator')

// GET
router.get('/', auth.verify, subscription.get(), SubscriberController.get)
router.get('/getAll', SubscriberController.fetchAll)
router.get('/getCart', SubscriberController.getCart)
router.put('/updateCartItem', SubscriberController.updateCartItem)

// POST
router.post('/register', subscription.register(), SubscriberController.register)

// UPDATE
router.patch(
  '/profile/',
  subscription.update(),
  SubscriberController.updateProfile
)
router.patch(
  '/address/',
  subscription.update(),
  SubscriberController.updateAddress
)

module.exports = router
