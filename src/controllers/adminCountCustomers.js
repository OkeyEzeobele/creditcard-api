import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function adminCountCustomers(req, res) {
  try {
    const count = await db.user.count();

    return respondWithSuccess(res, 200, 'success', {
      count,
    });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default adminCountCustomers;
