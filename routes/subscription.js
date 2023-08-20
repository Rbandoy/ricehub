const express = require('express');
const router = express.Router();

const SubscriberController = require('../controller/SubscriberController');
const subscription = require('../middleware/Validator/SubscriberValidator');

router.get('/:id', subscription.get(), SubscriberController.get);
router.post('/register', subscription.create(), SubscriberController.create);
router.patch(
  '/profile/:id',
  subscription.update(),
  SubscriberController.updateProfile,
);

module.exports = router;
