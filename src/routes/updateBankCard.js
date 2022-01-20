// Controller
import updateBankCard from '../controllers/updateBankCard';

// Validator
import updateBankCardValidator from '../validators/updateBankCard';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.post('/api/v1/update-bank-card', updateBankCardValidator, ValidationMiddleware, isAuthorized, updateBankCard);
};
