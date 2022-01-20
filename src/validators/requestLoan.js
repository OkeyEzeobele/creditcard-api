import { body } from 'express-validator/check';

export default [
  body('amount')
    .not()
    .isEmpty()
    .withMessage('Amount is required')
    .isInt()
    .withMessage('Provide only numeric digits'),
  body('tenure')
    .not()
    .isEmpty()
    .withMessage('Number of Tenure (months) is required')
    .isInt()
    .withMessage('Provide only numeric digits'),

];
