import { body } from 'express-validator/check';

export default [
  body('billerCode')
    .not()
    .isEmpty()
    .withMessage('Biller Code is required'),
  body('itemCode')
    .not()
    .isEmpty()
    .withMessage('Item Code is required'),
  body('customerId')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Customer Id is required'),
];
