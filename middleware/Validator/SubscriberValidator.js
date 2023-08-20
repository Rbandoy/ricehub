const { param, body } = require('express-validator');
const validationWrapper = require('./validation-wrapper');

const subscription = {};

subscription.get = () => {
  return validationWrapper([
    param('id')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required'),
  ]);
};
subscription.create = () => {
  return validationWrapper([
    body('password')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Password field required!'),
    body('username')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('username field required!'),
    body('profile.first_name')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('first_name field required!'),
    body('profile.last_name')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('last_name field required!'),
    body('profile.middle_name').optional(),
    body('profile.birth_date')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('birth_date field required!'),
    body('profile.email')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('email field required!'),
    body('profile.phone_number')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('phone_number field required!'),
    body('profile.gender')
      .isIn(['Male', 'Female'])
      .withMessage('Invalid Gender'),
    body('address.municipality')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('address municipality field required!'),
    body('address.city')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('address city field required!'),
    body('address.province')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('address province field required!'),
    body('address.postal_code')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('address postal_code field required!'),
    body('address.street')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('street field required!'),
    body('address.municipality1')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('address municipality1 field required!'),
    body('address.city1')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('city1 field required!'),
    body('address.province1')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('province1 field required!'),
    body('address.postal_code1')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('postal_code1 field required!'),
    body('address.street1')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('street1 field required!'),
  ]);
};

subscription.update = () => {
  return validationWrapper([
    param('id')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Subscriber Id Required'),
  ]);
};

module.exports = subscription;
