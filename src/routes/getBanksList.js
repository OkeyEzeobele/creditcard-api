import getBanksList from '../controllers/getBanksList';

import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/get-banks-list', isAuthorized, getBanksList);
};
