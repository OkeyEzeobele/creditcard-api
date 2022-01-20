// Controller
import { UpdatePin, SetupPin } from '../controllers/securitypin';
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.post('/api/v1/spin', SetupPin);
  router.put('/api/v1/spin', isAuthorized,  UpdatePin);
};
