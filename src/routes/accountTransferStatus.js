// Controllers
import accountTransferStatus from '../controllers/accountTransferStatus';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import accountTransferStatusValidator from '../validators/accountTransferStatus';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/account-transfer-status', accountTransferStatusValidator, ValidationMiddleware, isAuthorized, accountTransferStatus);
};
