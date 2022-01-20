import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function adminGetCardDetails(req, res) {
  const { cardId } = req.params;

  try {
    const card = await db.O3card.findOne({
      where: { id: cardId },
    });

    if (!card) {
      return respondWithWarning(res, 404, 'Card does not exist');
    }

    const user = await db.user.findOne({
      where: { id: card.userId },
      attributes: { exclude: ['password'] },
    });

    const personalInfo = await db.personalInfo.findOne({
      where: { userId: card.userId },
    });

    return respondWithSuccess(res, 200, 'success', {
      card, user, personalInfo,
    });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default adminGetCardDetails;
