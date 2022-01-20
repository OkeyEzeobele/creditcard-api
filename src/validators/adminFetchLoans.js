import { query } from 'express-validator/check';

export default [
  query('status')
    .not()
    .isEmpty()
    .withMessage('Provide a loan status (pending or created)'),
];
