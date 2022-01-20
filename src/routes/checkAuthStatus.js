// Controller
import checkAuthStatus from '../controllers/checkAuthStatus';

// Middleware
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/check-auth-status', isAuthorized, checkAuthStatus);
};
