// Controller
import getEmployerInfo from '../controllers/getEmployerInfo';

// Middleware
import hasValidPermissions from '../middlewares/hasValidPermission';

export default (router) => {
  router.get('/api/v1/get-employer-info', hasValidPermissions, getEmployerInfo);
};
