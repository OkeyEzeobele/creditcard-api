import requestBill from '../controllers/requestBill';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import requestBillValidator from '../validators/requestBill';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/request-bill', requestBillValidator, ValidationMiddleware, isAuthorized, requestBill);
};
