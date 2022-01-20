import { body } from 'express-validator/check';

export default [
  body('cifNumber')
    .not()
    .isEmpty()
    .withMessage('Cif Number is required')
    .isInt({
      allow_leading_zeroes: true,
    })
    .withMessage('Provide only numeric digits'),
  body('pin')
    .not()
    .isEmpty()
    .withMessage('Pin is required'),
];
