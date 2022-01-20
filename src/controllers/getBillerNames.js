import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function getBillerNames(req, res) {
  try {
    const billernames = await db.billername.findAll();

    if (!billernames.length) {
      return respondWithWarning(res, 404, 'Biller names not added yet');
    }
    return respondWithSuccess(res, 200, 'success', billernames);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default getBillerNames;
