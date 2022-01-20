import { body } from 'express-validator/check';

export default [
  body('loanId')
    .not()
    .isEmpty()
    .withMessage('Provide a loan ID'),
];
