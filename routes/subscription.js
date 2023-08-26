const express = require('express')
const router = express.Router()

const SubscriberController = require('../controller/SubscriberController')
const subscription = require('../middleware/Validator/SubscriberValidator')

router.get('/:subscriber_id', subscription.get(), SubscriberController.get)
router.post('/register', subscription.create(), SubscriberController.create)
router.patch(
  '/profile/:subscriber_id',
  subscription.update(),
  SubscriberController.updateProfile
)
router.patch(
  '/address/:subscriber_id',
  subscription.update(),
  SubscriberController.updateAddress
)

module.exports = router
