// Controller
import CreateBeneficiary from '../controllers/createBeneficiary';

// Validator
import createBeneficiaryValidator from '../validators/createBeneficiary';
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.post('/api/v1/create-beneficiary', createBeneficiaryValidator, ValidationMiddleware, isAuthorized, CreateBeneficiary);
};
