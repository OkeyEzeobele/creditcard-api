import { param } from 'express-validator/check';

export default [
  param('billId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Bill ID is required'),
];
