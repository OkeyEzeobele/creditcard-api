import { body } from 'express-validator/check';

export default [
  body('userId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('User Id is required'),
];
