// Controller
import { adminFetchCustomers, customerDetail } from '../controllers/adminFetchCustomers';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-fetch-customers', isAdmin, adminFetchCustomers);
  router.get('/api/v1/admin-fetch-customers/:id/detail', isAdmin, customerDetail);
};
