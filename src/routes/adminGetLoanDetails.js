// Controller
import adminGetLoanDetails from '../controllers/adminGetLoanDetails';

// Middleware
import getLoanValidator from '../validators/getLoan';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-get-loan-details/:loanId',
    getLoanValidator,
    ValidationMiddleware,
    isAdmin,
    adminGetLoanDetails);
};
