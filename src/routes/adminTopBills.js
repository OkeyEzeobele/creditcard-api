// Controller
import adminTopBills from '../controllers/adminTopBills';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-top-bills', isAdmin, adminTopBills);
};
