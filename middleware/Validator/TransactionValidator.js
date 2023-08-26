const { body, query } = require('express-validator')
const validationWrapper = require('../../api-helpers/lib/validation-wrapper')

const transaction = {}

transaction.get = () => {
  return validationWrapper([
    query('subscriber_id')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required'),
  ])
}
transaction.create = () => {
  return validationWrapper([
    body('subscriber_id')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required'),
    body('amount').exists().trim().notEmpty().withMessage('amount Required'),
    body('no_of_months')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('no_of_months Required'),
    body('interest')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('interest Required'),
  ])
}

transaction.update = () => {
  return validationWrapper([
    query('subscriber_id')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required'),
  ])
}

module.exports = transaction
