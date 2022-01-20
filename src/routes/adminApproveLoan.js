// Controller
import adminApproveLoan from '../controllers/adminApproveLoan';

// Middleware
// Validator
import adminLoanUpdateValidator from '../validators/adminLoanUpdate';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/admin-approve-loan',
    adminLoanUpdateValidator,
    ValidationMiddleware,
    isAdmin,
    adminApproveLoan);
};
