import { initiatePasswordReset, resetPassword, mobilePasswordReset } from '../controllers/passwordReset';

import { initiatePasswordResetValidator, resetPasswordValidator } from '../validators/passwordReset';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/initiate-password-reset', initiatePasswordResetValidator, ValidationMiddleware, initiatePasswordReset);
  router.post('/api/v1/password-reset', initiatePasswordResetValidator, ValidationMiddleware, mobilePasswordReset);
  router.post('/api/v1/reset-password', resetPasswordValidator, ValidationMiddleware, resetPassword);
};
