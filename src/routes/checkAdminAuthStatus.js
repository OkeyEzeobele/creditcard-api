// Controller
import checkAdminAuthStatus from '../controllers/checkAdminAuthStatus';

// Middleware
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/check-admin-auth-status', isAdmin, checkAdminAuthStatus);
};
