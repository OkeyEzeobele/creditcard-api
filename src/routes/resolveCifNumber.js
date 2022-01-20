import resolveCifNumber from '../controllers/resolveCifNumber';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import resolveCifNumberValidator from '../validators/resolveCifNumber';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.get('/api/v1/resolve-cif-number/:cifNumber', resolveCifNumberValidator, ValidationMiddleware, isAuthorized, resolveCifNumber);
};
