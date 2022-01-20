import { body } from 'express-validator/check';

export default [
  body('accountNumber')
    .not()
    .isEmpty()
    .withMessage('Account Number is required')
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage('Account Number should be 10 digits')
    .isInt({
      allow_leading_zeroes: true,
    })
    .withMessage('Account Number should be a numeric value'),
  body('bankCode')
    .not()
    .isEmpty()
    .withMessage('Bank code is required')
    .isLength({
      min: 3,
      max: 3,
    })
    .withMessage('Bank Code should be 3 digits')
    .isInt({
      allow_leading_zeroes: true,
    })
    .withMessage('Bank Code should be a numeric value'),
  body('currency')
    .not()
    .isEmpty()
    .withMessage('Currency is required')
    .matches(/\b(?:NGN|GHS|KES|USD|TZS|UGX|ZAR)\b/i)
    .withMessage('Enter a supported currency '),
  body('accountName')
    .not()
    .isEmpty()
    .withMessage('Account Name is required')
    .isLength({
      min: 4,
      max: 80,
    })
    .withMessage('Account Name should be greater than 3 words'),
];
