const { body, query } = require('express-validator')
const validationWrapper = require('../../api-helpers/lib/validation-wrapper')

const subscription = {}

subscription.get = () => {
  return validationWrapper([
    query('subscriber_id')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required'),
  ])
}
subscription.register = () => {
  return validationWrapper([
    body('password')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Password field required!')
      .bail(),
    body('username')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('username field required!')
      .bail(),
    body('profile.email')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('email field required!')
      .bail(),
    body('profile.phone_number')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('phone_number field required!')
      .bail(),
  ])
}

subscription.update = () => {
  return validationWrapper([
    query('subscriber_id')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required')
      .bail(),
  ])
}

module.exports = subscription
