// Controllers
import { verifyUserEmail, resendActivationEmail } from '../controllers/verifyUserEmail';

// Validator
import { resendActivationEmailValidator, userVerificationValidator } from '../validators/verifyUser';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.get('/api/v1/email-verification', userVerificationValidator, ValidationMiddleware, verifyUserEmail);
  router.post('/api/v1/resend-activation-mail', resendActivationEmailValidator, ValidationMiddleware, resendActivationEmail);
};
