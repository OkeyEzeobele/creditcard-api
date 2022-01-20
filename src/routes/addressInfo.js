// Controller
import CreateAddressInfo from '../controllers/createAddressInfo';
import UpdateAddressInfo from '../controllers/updateAddressInfo';

import isAuthorized from '../middlewares/isAuthorized';

// Validator
import ManageAddressInfoValidator from '../validators/addressInfo';
import ValidationMiddleware from '../validators/ValidationMiddleware';

export default (router) => {
  router.post('/api/v1/create-address-info', ManageAddressInfoValidator, ValidationMiddleware, isAuthorized, CreateAddressInfo);
  router.post('/api/v1/update-address-info', isAuthorized, UpdateAddressInfo);
};
