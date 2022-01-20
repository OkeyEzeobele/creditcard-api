import { body } from 'express-validator/check';

export default [
  body('cif')
    .not()
    .isEmpty()
    .withMessage('CIF number is required')
    .withMessage('Provide only numeric digits'),
];
