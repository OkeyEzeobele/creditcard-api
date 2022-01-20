import { initiateAdminCreation, createAdmin } from '../controllers/createAdmin';

import { initiateAdminCreationValidator, createAdminValidator } from '../validators/createAdmin';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/initiate-admin-registration', initiateAdminCreationValidator, ValidationMiddleware, isAdmin, initiateAdminCreation);
  router.post('/api/v1/admin-registration', createAdminValidator, ValidationMiddleware, createAdmin);
};
