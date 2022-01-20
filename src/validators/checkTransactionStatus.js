import { query } from 'express-validator/check';

export default [
  query('txref')
    .not()
    .isEmpty()
    .withMessage('Transaction reference is required'),
];
