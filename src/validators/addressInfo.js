import { body } from 'express-validator/check';

export default [
  body('homeAddress')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Home Address is required'),
  body('homeCity')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Home City is required'),
  body('homeCountry')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Home Country is required'),
  body('mailingAddress')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Mailing Address is required'),
  body('mailingCity')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Mailing City is required'),
  body('mailingCountry')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Mailing Country is required'),
  body('residencyYears')
    .not()
    .isEmpty()
    .withMessage('Residency years is required')
    .isLength({
      max: 3,
    })
    .withMessage('Residency years must not be greater than 3 digits')
    .isInt()
    .withMessage('Provide only numeric digits'),
];
