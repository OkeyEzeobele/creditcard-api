// Controller
import adminSumOpenLoans from '../controllers/adminSumOpenLoans';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-sum-open-loans', isAdmin, adminSumOpenLoans);
};
