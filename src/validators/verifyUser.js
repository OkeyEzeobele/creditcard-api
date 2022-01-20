import { body, query } from 'express-validator/check';

const resendActivationEmailValidator = [
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

const userVerificationValidator = [
  query('token')
    .not()
    .isEmpty()
    .withMessage('Token is required'),
];

export { resendActivationEmailValidator, userVerificationValidator };
