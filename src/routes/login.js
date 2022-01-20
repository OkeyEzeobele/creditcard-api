// Controller
import LoginController from '../controllers/login';

// Validator
import LoginValidator from '../validators/login';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/login', LoginValidator, ValidationMiddleware, LoginController);
};
