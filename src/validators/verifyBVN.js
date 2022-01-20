import { body } from 'express-validator/check';

export default [
  body('bvn')
    .not()
    .isEmpty()
    .withMessage('BVN is required'),
  body('phone')
    .not()
    .isEmpty()
    .withMessage('Phone number is required')
    .isLength({
      min: 11,
      max: 11,
    })
    .withMessage('Phone number must be 11 digits')
    .isInt()
    .withMessage('Provide only numeric digits'),
];
