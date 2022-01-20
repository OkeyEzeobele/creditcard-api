import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function requestCreditCard(req, res) {
  const { id: userId } = req.userData;
  const { amount } = req.body;

  try {
    await db.ccrequest.create({
      userId,
      amount,
    });
    return respondWithSuccess(res, 200, 'Credit card request sent successfully');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default requestCreditCard;
