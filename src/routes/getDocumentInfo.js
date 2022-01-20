// Controller
import getDocumentInfo from '../controllers/getDocumentInfo';

// Middleware
import hasValidPermissions from '../middlewares/hasValidPermission';

export default (router) => {
  router.get('/api/v1/get-documents', hasValidPermissions, getDocumentInfo);
};
