// Controller
import getLoan from '../controllers/getLoan';

// Middleware
import getLoanValidator from '../validators/getLoan';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/get-loan/:loanId',
    getLoanValidator,
    ValidationMiddleware,
    isAuthorized,
    getLoan);
};
