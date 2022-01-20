// Controller
import getPersonalInfo from '../controllers/getPersonalInfo';

// Middleware
import hasValidPermissions from '../middlewares/hasValidPermission';

export default (router) => {
  router.get('/api/v1/get-personal-info', hasValidPermissions, getPersonalInfo);
};
