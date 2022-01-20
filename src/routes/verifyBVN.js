import verifyBVN from '../controllers/verifyBVN';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import verifyBVNValidator from '../validators/verifyBVN';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/verify-bvn', verifyBVNValidator, ValidationMiddleware, isAuthorized, verifyBVN);
};
