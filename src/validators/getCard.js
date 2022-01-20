import { param } from 'express-validator/check';

export default [
  param('cardId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Card ID is required'),
];
