// Controller
import adminRejectLoan from '../controllers/adminRejectLoan';

// Middleware
// Validator
import adminLoanUpdateValidator from '../validators/adminLoanUpdate';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/admin-reject-loan',
    adminLoanUpdateValidator,
    ValidationMiddleware,
    isAdmin,
    adminRejectLoan);
};
