// Controllers
import adminExpireProfileSegment from '../controllers/adminExpireProfileSegment';

import blockUser from '../validators/blockUser';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/expire-profile-segment',
    blockUser,
    ValidationMiddleware,
    isAdmin,
    adminExpireProfileSegment);
};
