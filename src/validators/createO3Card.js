import { body } from 'express-validator/check';

export default [
  body('cardType')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Card Type is required')
    .matches(/\b(?:prepaid|credit)\b/)
    .withMessage('Invalid Card type Provided'),
];
