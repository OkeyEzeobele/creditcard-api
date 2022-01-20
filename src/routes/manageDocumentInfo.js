// Controller
import manageDocumentInfo from '../controllers/manageDocumentInfo';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import manageDocumentInfoValidator from '../validators/manageDocumentInfo';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/manage-document-info', manageDocumentInfoValidator, ValidationMiddleware, isAuthorized, manageDocumentInfo);
};
