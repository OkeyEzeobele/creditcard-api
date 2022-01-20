// Controller
import getAddressInfo from '../controllers/getAddressInfo';

// Middleware
import hasValidPermissions from '../middlewares/hasValidPermission';

export default (router) => {
  router.get('/api/v1/get-address-info', hasValidPermissions, getAddressInfo);
};
