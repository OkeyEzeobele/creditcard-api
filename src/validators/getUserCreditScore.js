import { query } from 'express-validator/check';

export default [
  query('userId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('User Id is required'),
  query('loanId')
    .not()
    .isEmpty()
    .withMessage('loan ID is required'),
];
