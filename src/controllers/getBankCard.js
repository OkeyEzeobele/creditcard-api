import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function getBankCard(req, res) {
  let userId;
  const { adminData } = req;
  if (adminData) {
    userId = req.query.id;
    if (!userId) {
      return respondWithWarning(res, 400, 'Please Enter a userId');
    }
  } else {
    userId = req.userData.id;
  }
  try {
    const bankcard = await db.bankcard.find({
      where: { userId },
    });

    if (!bankcard) {
      return respondWithWarning(res, 404, 'Bank card not added yet');
    }
    return respondWithSuccess(res, 200, 'success', bankcard.toJSON());
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default getBankCard;
