// Controller
import SignupController from '../controllers/signup';

// Validator
import SignupValidator from '../validators/signup';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.get('/', (req, res) => { res.send('--service available--'); })
  router.post('/api/v1/signup', SignupValidator, ValidationMiddleware, SignupController);
};
