// Controller
import adminGetCardDetails from '../controllers/adminGetCardDetails';

// Middleware
import getCardValidator from '../validators/getCard';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-get-card-details/:cardId',
    getCardValidator,
    ValidationMiddleware,
    isAdmin,
    adminGetCardDetails);
};
