// Controller
import createPersonalInfo from '../controllers/createPersonalInfo';
import updatePersonalInfo from '../controllers/updatePersonalInfo';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import ManagePersonalInfoValidator from '../validators/personalInfo';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/create-personal-info', ManagePersonalInfoValidator, ValidationMiddleware, isAuthorized, createPersonalInfo);
  router.post('/api/v1/update-personal-info', isAuthorized, updatePersonalInfo);
};
