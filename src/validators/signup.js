import { body } from 'express-validator/check';

export default [
  body('fullName')
    .not()
    .isEmpty()
    .withMessage('Full name is required'),
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail({
      all_lowercase: true,
    })
    .withMessage('Provide a valid email'),
  body('password')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Password is required')
    .isLength({
      min: 6,
    })
    .withMessage('Password must be more than 6'),
  body('phone')
    .not()
    .isEmpty()
    .withMessage('Phone number is required')
    .isLength({
      min: 7,
      max: 11,
    })
    .withMessage('Phone number must be 7 to 11 digits')
    .isInt()
    .withMessage('Provide only numeric digits'),
  body('pushToken')
    .not()
    .isEmpty()
    .withMessage('Push token number is required'),
  // body('spin')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Spin value is required'),
  body('deviceId')
    .not()
    .isEmpty()
    .withMessage('Device ID is required'),
  body('dob')
    .not()
    .isEmpty()
    .withMessage('Date is required')
    // .toDate()
    .isISO8601()
    .withMessage('Invalid date supplied'),
  body('tandc')
    .not()
    .isEmpty()
    .withMessage('You must agree to our terms before continuing'),
];
