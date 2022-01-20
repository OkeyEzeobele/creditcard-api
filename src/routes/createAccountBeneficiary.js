// Controller
import CreateAccountBeneficiary from '../controllers/createAccountBeneficiary';

// Validator
import CreateAccountBeneficiaryValidator from '../validators/createAccountBeneficiary';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.post('/api/v1/create-account-beneficiary', CreateAccountBeneficiaryValidator, ValidationMiddleware, isAuthorized, CreateAccountBeneficiary);
};
