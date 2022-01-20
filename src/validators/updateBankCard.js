import { body } from 'express-validator/check';
import moment from 'moment';

const currentYear = moment().year();

export default [
  body('first6')
    .trim()
    .isLength({
      min: 6,
      max: 6,
    })
    .withMessage('Must contain 6 digits')
    .isInt()
    .withMessage('Provide numeric digits only'),
  body('last4')
    .trim()
    .isLength({
      min: 4,
      max: 4,
    })
    .withMessage('Must contain 4 digits')
    .isInt()
    .withMessage('Provide numeric digits only'),
  body('expiryMonth')
    .trim()
    .isLength({
      min: 2,
      max: 2,
    })
    .withMessage('Expiry Month must not be greater than 2 digits')
    .isInt({
      allow_leading_zeroes: true,
      lt: 13,
      gt: 0,
    })
    .withMessage('Provide only numeric digits'),
  body('expiryYear')
    .trim()
    .isLength({
      min: 4,
      max: 4,
    })
    .withMessage('Card Expiry Year must be 4 digits')
    .isInt({
      allow_leading_zeroes: false,
      lt: currentYear + 4,
      gt: currentYear - 1,
    })
    .withMessage('Provide only numeric digits, make sure expiry date is valid'),
  body('hash')
    .trim(),
  body('token')
    .trim(),
  body('local')
    .isBoolean()
    .withMessage('Local should be a boolean'),
];
