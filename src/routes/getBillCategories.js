// Controller
import GetBillCategories from '../controllers/getBillCategories';

// Middleware
import isAuthorized from '../middlewares/isAuthorized';


export default (router) => {
  router.get('/api/v1/get-bill-categories', isAuthorized, GetBillCategories);
};
