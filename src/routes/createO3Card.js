// Controller
import createO3Card from '../controllers/createO3Card';

// Validator
import createO3CardValidator from '../validators/createO3Card';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.post('/api/v1/create-O3-card', createO3CardValidator, ValidationMiddleware, isAuthorized, createO3Card);
};
