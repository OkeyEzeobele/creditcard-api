import { param } from 'express-validator/check';

export default [
  param('loanId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Loan ID is required'),
];
