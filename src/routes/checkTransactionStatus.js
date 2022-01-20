// Controller
import checkTransactionStatus from '../controllers/checkTransactionStatus';

// Middleware
import isAuthorized from '../middlewares/isAuthorized';

// Validator
import checkTransactionStatusValidator from '../validators/checkTransactionStatus';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.get('/api/v1/check-transaction-status',
    checkTransactionStatusValidator,
    ValidationMiddleware,
    isAuthorized,
    checkTransactionStatus);
};
