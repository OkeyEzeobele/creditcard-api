// Controller
import AdminLoginController from '../controllers/adminLogin';

// Validator
import LoginpValidator from '../validators/login';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/admin-login', LoginpValidator, ValidationMiddleware, AdminLoginController);
};
