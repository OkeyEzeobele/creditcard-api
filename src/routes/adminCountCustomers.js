// Controller
import adminCountCustomers from '../controllers/adminCountCustomers';

// Middleware
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-count-customers', isAdmin, adminCountCustomers);
};
