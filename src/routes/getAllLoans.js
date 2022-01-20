// Controller
import getAllLoans from '../controllers/getAllLoans';

import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/get-all-loans',
    isAuthorized,
    getAllLoans);
};
