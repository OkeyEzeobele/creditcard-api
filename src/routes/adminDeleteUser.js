import deleteUser from '../controllers/adminDeleteUser';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.post('/api/v1/admin-delete-user', isAdmin, deleteUser );
}