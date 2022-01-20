import { body } from 'express-validator/check';

export default [
  body('amount')
    .not()
    .isEmpty()
    .withMessage('Amount is required')
    .isInt()
    .withMessage('Provide only numeric digits'),
  body('cardId')
    .not()
    .isEmpty()
    .withMessage('Card Id is required'),
  body('customerId')
    .not()
    .isEmpty()
    .withMessage('Customer ID is required'),
  body('billerName')
    .not()
    .isEmpty()
    .withMessage('Bller Name is required'),
  body('country')
    .not()
    .isEmpty()
    .withMessage('Country is required'),
  body('pin')
    .not()
    .isEmpty()
    .withMessage('Pin is required'),
];
