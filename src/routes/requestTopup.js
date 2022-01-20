// Controller
import requestTopup from '../controllers/requestTopup';
import requestLoanPayment from '../controllers/requestLoanPayment';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import RequestTopupValidator from '../validators/requestTopup';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/request-topup', RequestTopupValidator, ValidationMiddleware, isAuthorized, requestTopup);
  router.post('/api/v1/request-loanpayment', RequestTopupValidator, ValidationMiddleware, isAuthorized, requestLoanPayment);
};
