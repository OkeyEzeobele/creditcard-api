import unirest from 'unirest';
// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function getBanksList(req, res) {
  try {
    const moneyRaveStagingUrl = process.env.MONEY_RAVE_URL;

    const banksList = await unirest
      .post(`${moneyRaveStagingUrl}/v1/banks?country=NG`)
      .headers({
        'Content-Type': 'application/json',
      });
    const { body: { status, data } } = banksList;
    if (status === 'success') {
      return respondWithSuccess(res, 200, 'success', { banks: data });
    }

    return respondWithWarning(res, 401, 'error');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default getBanksList;
