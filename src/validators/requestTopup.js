import { body } from 'express-validator/check';

export default [
  body('amount')
    .not()
    .isEmpty()
    .withMessage('Amount is required')
    .isInt()
    .withMessage('Provide only numeric digits'),
  body('cardId')
    .not()
    .isEmpty()
    .withMessage('Card Id is required'),
];
