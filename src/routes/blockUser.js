import blockUsers from '../controllers/blockUsers';

import blockUserValidator from '../validators/blockUser';
import ValidationMiddleware from '../validators/ValidationMiddleware';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/block-user', blockUserValidator, ValidationMiddleware, isAdmin, blockUsers);
};
