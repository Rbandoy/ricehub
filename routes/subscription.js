const express = require('express')
const router = express.Router()
const auth = require('../controller/authentication/auth')
const SubscriberController = require('../controller/SubscriberController')
const subscription = require('../middleware/Validator/SubscriberValidator')

// GET
router.get('/', auth.verify, subscription.get(), SubscriberController.get)
router.get('/getAll', auth.verify, SubscriberController.fetchAll)
router.get('/getCart', auth.verify, SubscriberController.getCart)
router.put(
  '/updateCartItemQuantity',
  auth.verify,
  SubscriberController.updateCartItemQuantity
)

router.put(
  '/updateCartIsForOrder',
  auth.verify,
  SubscriberController.updateCartIsForOrder
)

// POST
router.post('/register', subscription.register(), SubscriberController.register)
router.post('/addCart', SubscriberController.addCart)

// UPDATE
router.patch(
  '/profile/',
  auth.verify,
  subscription.update(),
  SubscriberController.updateProfile
)
router.patch(
  '/address/',
  auth.verify,
  subscription.update(),
  SubscriberController.updateAddress
)

router.patch(
  '/info/',
  auth.verify,
  subscription.update(),
  SubscriberController.updateProfileAndAddress
)

module.exports = router
