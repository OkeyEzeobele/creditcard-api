import { body } from 'express-validator/check';

const initiatePasswordResetValidator = [
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail({
      all_lowercase: true,
    })
    .withMessage('Provide a valid email'),
];

const resetPasswordValidator = [
  body('id')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Id is required'),
  body('token')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Token is required'),
  body('password')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Password is required')
    .isLength({
      min: 6,
    })
    .withMessage('Password must be more than 6'),
];

export { initiatePasswordResetValidator, resetPasswordValidator };
