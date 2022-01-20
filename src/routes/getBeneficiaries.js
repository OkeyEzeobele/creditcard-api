// Controller
import GetBeneficiaries from '../controllers/getBeneficiaries';

// Middleware
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/beneficiaries', isAuthorized, GetBeneficiaries);
};
