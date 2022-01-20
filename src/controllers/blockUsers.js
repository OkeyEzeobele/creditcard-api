import db from '../db';

// helpers
import logger from '../helpers/logger';
import permissions from '../permissions/index';
import getRoutePermission from '../helpers/getRoutePermission';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function blockUser(req, res) {
  const { role } = req.adminData;
  const routePermission = getRoutePermission(req.url);

  if (!permissions[role].includes(routePermission)) {
    return respondWithWarning(res, 403, { message: 'Forbidden, Only Super Admins are allowed to perform this action' });
  }
  const { userId: id } = req.body;
  try {
    const user = await db.user.find({
      where: { id },
    });

    if (!user) {
      return respondWithWarning(res, 404, 'User not found');
    }
    const blockedUser = await user.update({ isBlocked: true });
    return respondWithSuccess(res, 200, 'User Blocked Successfully', blockedUser.dataValues);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default blockUser;
