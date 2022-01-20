import validateBillId from '../controllers/validateBillId';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import validateBillIdValidator from '../validators/validateBillId';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/validate-bill-id', validateBillIdValidator, ValidationMiddleware, isAuthorized, validateBillId);
};
