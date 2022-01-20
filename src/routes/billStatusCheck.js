// Controllers
import billStatusCheck from '../controllers/billStatusCheck';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import billStatusCheckValidator from '../validators/billStatusCheck';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/bill-status-check', billStatusCheckValidator, ValidationMiddleware, isAuthorized, billStatusCheck);
};
