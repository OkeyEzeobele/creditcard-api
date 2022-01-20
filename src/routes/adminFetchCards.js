// Controller
import { fetchCards, cardDetail, cardBalance, cardQuery, cardState, fetchCardRequest, fetchApprovedRequest, fetchRejectedRequest} from '../controllers/adminFetchCards';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-fetch-cards', isAdmin, fetchCards);
  router.get('/api/v1/admin-fetch-card-request', isAdmin, fetchCardRequest);
  router.get('/api/v1/admin-fetch-approved-request', isAdmin, fetchApprovedRequest);
  router.get('/api/v1/admin-fetch-rejected-request', isAdmin, fetchRejectedRequest);

  router.get('/api/v1/admin-fetch-cards/:id/detail', isAdmin, cardDetail);
  router.post('/api/v1/admin-fetch-cards/:id/balance', isAdmin, cardBalance);
  router.post('/api/v1/admin-fetch-cards/:id/query', isAdmin, cardQuery);
  router.post('/api/v1/admin-fetch-cards/:id/state', isAdmin, cardState);
};
