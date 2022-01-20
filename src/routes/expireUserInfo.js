// Controllers
import {
  expirePersonalInfo,
  expireAddressInfo,
  expireEmployerInfo,
  expireDocumentInfo,
  getExpiredFields,
} from '../controllers/expireUserInfo';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/expire-user-info/:id',
    isAdmin,
    expirePersonalInfo,
    expireAddressInfo,
    expireEmployerInfo,
    expireDocumentInfo,
    getExpiredFields);
};
