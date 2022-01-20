// Controller
import adminFetchAdmins from '../controllers/adminFetchAdmins';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-fetch-admins', isAdmin, adminFetchAdmins);
};
