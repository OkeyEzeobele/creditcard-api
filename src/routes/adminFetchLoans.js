// Controller
import adminFetchLoans from '../controllers/adminFetchLoans';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-fetch-loans',
    isAdmin,
    adminFetchLoans);
};
