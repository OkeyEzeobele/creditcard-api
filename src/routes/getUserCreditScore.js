// Controller
import getUserCreditScore from '../controllers/getUserCreditScore';

// Middleware
import getUserCreditScoreValidator from '../validators/getUserCreditScore';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/get-user-credit-score',
    getUserCreditScoreValidator,
    ValidationMiddleware,
    isAdmin,
    getUserCreditScore);
};
