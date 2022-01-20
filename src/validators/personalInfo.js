import { body } from 'express-validator/check';

export default [
  body('firstName')
    .not()
    .isEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .not()
    .isEmpty()
    .withMessage('Last name is required'),
  body('dob')
    .not()
    .isEmpty()
    .withMessage('Dob is required')
    .isISO8601()
    .withMessage('Enter a Valid Date'),
  body('gender')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Gender is required')
    .matches(/\b(?:male|female)\b/i)
    .withMessage('Provide a valid gender'),
  body('maritalStatus')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Marital Status is required')
    .matches(/\b(?:single|married)\b/i)
    .withMessage('Provide a valid marital status'),
  body('monthlyIncome')
    .not()
    .isEmpty()
    .withMessage('Monthly Income is required')
    .isInt()
    .withMessage('Provide only numeric digits')
    .isLength({
      min: 4,
    })
    .withMessage('Monthly Income must be greater than 3 digits'),
  // body('bvn')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Bvn is required')
  //   .isLength({
  //     min: 11,
  //     max: 11,
  //   })
  //   .withMessage('Bvn number must be 11 digits')
  //   .isInt()
  //   .withMessage('Provide only numeric digits'),
];
