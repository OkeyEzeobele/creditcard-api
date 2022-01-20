import { body } from 'express-validator/check';

export default [
  body('cifNumber')
    .not()
    .isEmpty()
    .withMessage('Cif Number is required'),
  body('cardHolderName')
    .not()
    .isEmpty()
    .withMessage('CardHolder Name is required'),
];
