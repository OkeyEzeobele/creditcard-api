import fetchVirtualCardBalance from '../controllers/fetchVirtualCardBalance';

import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/fetch-card-balance', isAuthorized, fetchVirtualCardBalance);
};
