import linkVirtualCard from '../controllers/linkVirtualCard';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import linkVirtualCardValidator from '../validators/linkVirtualCard';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/link-virtual-card', linkVirtualCardValidator, ValidationMiddleware, isAuthorized, linkVirtualCard);
};
