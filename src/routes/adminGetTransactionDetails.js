// Controller
import adminGetTransactionDetails from '../controllers/adminGetTransactionDetails';

// Middleware
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-get-transaction-details/:txrefId',
    isAdmin,
    adminGetTransactionDetails);
};
