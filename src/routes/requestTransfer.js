// Controller
import requestTransfer from '../controllers/requestTransfer';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import RequestTransferValidator from '../validators/requestTransfer';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/request-transfer', RequestTransferValidator, ValidationMiddleware, isAuthorized, requestTransfer);
};
