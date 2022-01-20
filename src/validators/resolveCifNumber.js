import { param } from 'express-validator/check';

export default [
  param('cifNumber')
    .not()
    .isEmpty()
    .withMessage('Cif Number is required')
    .isLength({
      min: 9,
      max: 9,
    })
    .withMessage('Cif number must be 11 digits')
    .isInt({
      allow_leading_zeroes: true,
    })
    .withMessage('Provide only numeric digits'),
];
