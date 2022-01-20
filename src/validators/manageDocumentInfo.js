import { body } from 'express-validator/check';

export default [
  body('type')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Document type is required'),
  body('data')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Document data is required'),
];
