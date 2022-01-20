import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function getCountries(req, res) {
  try {
    const countries = await db.country.findAll();

    if (!countries.length) {
      return respondWithWarning(res, 404, 'Countries not added yet');
    }
    return respondWithSuccess(res, 200, 'success', countries);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default getCountries;
