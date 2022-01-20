import _pick from 'lodash/pick';

import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function checkAuthStatus(req, res) {
  const { id } = req.userData;
  try {
    const user = await db.user.find({
      where: { id },
    });

    if (!user) {
      return respondWithWarning(res, 404, 'Account not found');
    }
    const userPayload = _pick(user.toJSON(), ['id', 'email', 'fullName']);
    return respondWithSuccess(res, 200, 'successful', userPayload);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default checkAuthStatus;
