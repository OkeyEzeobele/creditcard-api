// Controller
import createEmployerInfo from '../controllers/createEmployerInfo';
import updateEmployerInfo from '../controllers/updateEmployerInfo';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import ManageEmployerInfoValidator from '../validators/employerInfo';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/create-employer-info', ManageEmployerInfoValidator, ValidationMiddleware, isAuthorized, createEmployerInfo);
  router.post('/api/v1/update-employer-info', isAuthorized, updateEmployerInfo);
};
