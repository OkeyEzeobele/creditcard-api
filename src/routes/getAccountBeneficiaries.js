// Controller
import GetAccountBeneficiaries from '../controllers/getAccountBeneficiaries';

// Middleware
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/account-beneficiaries', isAuthorized, GetAccountBeneficiaries);
};
