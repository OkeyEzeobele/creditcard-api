import { body } from 'express-validator/check';

const initiateAdminCreationValidator = [
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail({
      all_lowercase: true,
    })
    .withMessage('Provide a valid email'),
  body('role')
    .not()
    .isEmpty()
    .withMessage('Role is required')
    .matches(/\b(?:admin|superAdmin)\b/)
    .withMessage('Invalid role Provided'),
];

const createAdminValidator = [
  body('token')
    .not()
    .isEmpty()
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

export { initiateAdminCreationValidator, createAdminValidator };
