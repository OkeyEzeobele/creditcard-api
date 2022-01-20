import { initiateAdminPasswordReset, resetAdminPassword } from '../controllers/adminPasswordReset';

import { initiatePasswordResetValidator, resetPasswordValidator } from '../validators/passwordReset';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/initiate-admin-password-reset', initiatePasswordResetValidator, ValidationMiddleware, initiateAdminPasswordReset);
  router.post('/api/v1/reset-admin-password', resetPasswordValidator, ValidationMiddleware, resetAdminPassword);
};
