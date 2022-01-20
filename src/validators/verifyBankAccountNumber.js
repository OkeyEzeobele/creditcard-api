import { body } from 'express-validator/check';

export default [
  body('accountNumber')
    .not()
    .isEmpty()
    .withMessage('Account number is required')
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('Account number must be 10 digits')
    .isInt()
    .withMessage('Provide only numeric digits'),
  body('bankCode')
    .not()
    .isEmpty()
    .withMessage('Bank code is required')
    .isLength({
      min: 3,
      max: 3,
    })
    .withMessage('Bank code must be 3 digits')
    .isInt()
    .withMessage('Provide only numeric digits'),
  body('currency')
    .not()
    .isEmpty()
    .withMessage('Currency is required'),
];
