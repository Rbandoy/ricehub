const { body, query } = require('express-validator')
const validationWrapper = require('../../api-helpers/lib/validation-wrapper')

const auth = {}

auth.create = () => {
  return validationWrapper([
    body('username')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required'),
    body('password')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required'),
  ])
}

auth.refresh = () => {
  return validationWrapper([
    body('token')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required'),
  ])
}

module.exports = auth
