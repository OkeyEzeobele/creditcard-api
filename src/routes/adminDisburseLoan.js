// Controller
import adminDisburseLoan from '../controllers/adminDisburseLoan';

// Middleware
// Validator
import adminLoanUpdateValidator from '../validators/adminLoanUpdate';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/admin-disburse-loan',
    adminLoanUpdateValidator,
    ValidationMiddleware,
    isAdmin,
    adminDisburseLoan);
};
