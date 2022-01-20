// Controller
import requestCreditCard from '../controllers/requestCreditCard';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import RequestCreditCardValidator from '../validators/requestCreditCard';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/request-credit-card',
    RequestCreditCardValidator,
    ValidationMiddleware,
    isAuthorized,
    requestCreditCard);
};
