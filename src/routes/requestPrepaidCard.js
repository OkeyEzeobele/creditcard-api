// Controller
import requestPrepaidCard from '../controllers/requestPrepaidCard';

import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.post('/api/v1/request-prepaid-card',
    isAuthorized,
    requestPrepaidCard);
};
