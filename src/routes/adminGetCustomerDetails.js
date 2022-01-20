// Controller
import adminGetCustomerDetails from '../controllers/adminGetCustomerDetails';

// Middleware
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-get-customer-details/:customerId', isAdmin, adminGetCustomerDetails);
};
