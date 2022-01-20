// Controller
import adminGetBillDetails from '../controllers/adminGetBillDetails';

// Middleware
import getBillValidator from '../validators/getBill';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-get-bill-details/:billId',
    getBillValidator,
    ValidationMiddleware,
    isAdmin,
    adminGetBillDetails);
};
