import { body } from 'express-validator/check';
import moment from 'moment';

const currentYear = moment().year();

export default [
  body('first6')
    .trim()
    .not()
    .isEmpty()
    .withMessage('First 6 digits of credit card is required')
    .isLength({
      min: 6,
      max: 6,
    })
    .withMessage('Must contain 6 digits')
    .isInt()
    .withMessage('Provide numeric digits only'),
  body('last4')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Last 4 digits of credit card is required')
    .isLength({
      min: 4,
      max: 4,
    })
    .withMessage('Must contain 4 digits')
    .isInt()
    .withMessage('Provide numeric digits only'),
  body('expiryMonth')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Card Expiry Month is required')
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
    .withMessage('Provide only numeric digits, make sure expiry month is valid'),
  body('expiryYear')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Card Expiry Year is required')
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
    .trim()
    .not()
    .isEmpty()
    .withMessage('Hash is required'),
  body('token')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Token is required'),
  body('local')
    .not()
    .isEmpty()
    .withMessage('Local is required')
    .isBoolean()
    .withMessage('Local can either be true or false'),
];
