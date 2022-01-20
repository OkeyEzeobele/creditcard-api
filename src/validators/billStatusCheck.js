import { body } from 'express-validator/check';

export default [
  body('txRef')
    .not()
    .isEmpty()
    .withMessage('Refernce value is required'),
];
