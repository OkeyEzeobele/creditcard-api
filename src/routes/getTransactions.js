// Controller
import getTransactions from '../controllers/getTransactions';

import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/get-transactions', isAuthorized, getTransactions);
};
