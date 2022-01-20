import unlinkVirtualCard from '../controllers/adminUnlinkCard';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/admin-unlink-card', isAdmin, unlinkVirtualCard);
}