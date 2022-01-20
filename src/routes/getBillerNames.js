// Controller
import getBillerNames from '../controllers/getBillerNames';

// Middleware
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/get-biller-names',
    isAuthorized,
    getBillerNames);
};
