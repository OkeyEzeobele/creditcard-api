// Controller
import verifyBankAccountNumber from '../controllers/verifyBankAccountNumber';
import verifyCifNumber from '../controllers/verifyCifNumber';

// Validator
import verifyBankAccountNumberValidator from '../validators/verifyBankAccountNumber';
import verifyCifAccountNumberValidator from '../validators/verifyCifNumber'
import ValidationMiddleware from '../validators/ValidationMiddleware';
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.post('/api/v1/verify-bank-account-number',
    verifyBankAccountNumberValidator,
    ValidationMiddleware,
    isAuthorized,
    verifyBankAccountNumber);

  router.post('/api/v1/verify-cif-number',
    verifyCifAccountNumberValidator,
    ValidationMiddleware,
    isAuthorized,
    verifyCifNumber); 
};
