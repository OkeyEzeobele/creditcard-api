// Controller
import createBankCard from '../controllers/createBankCard';

// Validator
import createBankCardValidator from '../validators/createBankCard';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.post('/api/v1/create-bank-card', createBankCardValidator, ValidationMiddleware, isAuthorized, createBankCard);
};
