// Controllers
import {
  checkPersonalInfo,
  checkAddressInfo,
  checkEmployerInfo,
  checkDocumentInfo,
  getExpiredFields,
} from '../controllers/checkRequiredInfo';

import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.post('/api/v1/check-required-info',
    isAuthorized,
    checkPersonalInfo,
    checkAddressInfo,
    checkEmployerInfo,
    checkDocumentInfo,
    getExpiredFields);
};
