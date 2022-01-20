import { body } from 'express-validator/check';

export default [
  body('amount')
    .not()
    .isEmpty()
    .withMessage('Amount is required')
    .isInt()
    .withMessage('Provide only numeric digits'),
  body('recepient')
    .not()
    .isEmpty()
    .withMessage('Recepient type is required')
    .isIn(['bank', 'card'])
    .withMessage('Invalid recepient type'),
  body('cardId')
    .not()
    .isEmpty()
    .withMessage('Card Id is required'),
  body('pin')
    .not()
    .isEmpty()
    .withMessage('Pin is required'),
];
