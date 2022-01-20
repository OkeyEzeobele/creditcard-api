import { body } from 'express-validator/check';

export default [
  body('profession')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Profession is required'),
  body('organizationName')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Organization Name is required'),
  body('yearsOnJob')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Years on Job is required')
    .isLength({
      max: 3,
    })
    .withMessage('Years on Job must not be greater than 3 digits')
    .isInt()
    .withMessage('Provide only numeric digits'),
  body('employerAddress')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Employer Address is required'),
  body('city')
    .trim()
    .not()
    .isEmpty()
    .withMessage('City is required'),
  body('country')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Country is required'),
  body('monthlySalary')
    .not()
    .isEmpty()
    .withMessage('Monthly Salary is required')
    .isLength({
      min: 4,
    })
    .withMessage('Monthly Salary must be greater than 3 digits')
    .isInt()
    .withMessage('Provide only numeric digits'),
];
