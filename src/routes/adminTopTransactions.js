// Controller
import adminTopTransactions from '../controllers/adminTopTransactions';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-top-transactions', isAdmin, adminTopTransactions);
};
