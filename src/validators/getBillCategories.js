import { query } from 'express-validator/check';

export default [
  query('billerName')
    .not()
    .isEmpty()
    .withMessage('Biller Name is required'),
  query('country')
    .not()
    .isEmpty()
    .trim()
    .withMessage('country code is required'),
];
