import { body } from 'express-validator/check';

export default [
  body('amount')
    .not()
    .isEmpty()
    .withMessage('Amount is required')
    .isInt()
    .withMessage('Provide only numeric digits'),
];
