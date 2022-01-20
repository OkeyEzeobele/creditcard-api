// Controller
import requestLoan from '../controllers/requestLoan';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import RequestLoanValidator from '../validators/requestLoan';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/request-loan', RequestLoanValidator, ValidationMiddleware, isAuthorized, requestLoan);
};
