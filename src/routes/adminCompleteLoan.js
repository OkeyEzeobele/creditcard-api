// Controller
import adminCompleteLoan from '../controllers/adminCompleteLoan';

// Middleware
// Validator
import adminLoanUpdateValidator from '../validators/adminLoanUpdate';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/admin-complete-loan',
    adminLoanUpdateValidator,
    ValidationMiddleware,
    isAdmin,
    adminCompleteLoan);
};
