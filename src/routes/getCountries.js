// Controller
import getCountries from '../controllers/getCountries';

// Middleware
import isAuthorized from '../middlewares/isAuthorized';

export default (router) => {
  router.get('/api/v1/get-countries',
    isAuthorized,
    getCountries);
};
