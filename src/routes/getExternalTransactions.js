// Controller
import getExternalTransactions from '../controllers/getExternalTransactions';

//import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/get-external-transactions', getExternalTransactions);
};
