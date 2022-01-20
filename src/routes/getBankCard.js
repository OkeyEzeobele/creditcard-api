// Controller
import getBankCard from '../controllers/getBankCard';

// Middleware
import hasValidPermissions from '../middlewares/hasValidPermission';

export default (router) => {
  router.get('/api/v1/get-bank-card', hasValidPermissions, getBankCard);
};
