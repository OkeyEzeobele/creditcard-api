// Controller
import adminCurrentOpenLoans from '../controllers/adminCurrentOpenLoans';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-current-open-loans', isAdmin, adminCurrentOpenLoans);
};
