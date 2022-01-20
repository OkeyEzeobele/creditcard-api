// Controller
import adminFetchBills from '../controllers/adminFetchBills';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-fetch-bills', isAdmin, adminFetchBills);
};
