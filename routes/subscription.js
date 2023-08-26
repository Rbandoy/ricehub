const express = require('express')
const router = express.Router()

const SubscriberController = require('../controller/SubscriberController')
const subscription = require('../middleware/Validator/SubscriberValidator')

router.get('/:subscriber_id', subscription.get(), SubscriberController.get)
router.post('/register', subscription.create(), SubscriberController.create)
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
