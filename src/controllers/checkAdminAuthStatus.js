import _pick from 'lodash/pick';

import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function checkAdminAuthStatus(req, res) {
  const { id } = req.adminData;
  try {
    const admin = await db.admin.find({
      where: { id },
    });

    if (!admin) {
      return respondWithWarning(res, 404, 'Admin Account not found');
    }
    const adminPayload = _pick(admin.toJSON(), ['id', 'email', 'role']);
    return respondWithSuccess(res, 200, 'Successful', adminPayload);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default checkAdminAuthStatus;
