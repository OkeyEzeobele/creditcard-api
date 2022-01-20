import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function updateBankCard(req, res) {
  const { id: userId } = req.userData;

  try {
    const bankCardInfo = await db.bankcard.find({ where: { userId } });

    if (!bankCardInfo) {
      return respondWithWarning(res, 404, 'Bank Card Information not added yet');
    }

    const updatedBankCard = await bankCardInfo.update(req.body,
      { fields: Object.keys(req.body) });

    return respondWithSuccess(res, 200, 'Bank Card Information Updated Successfully', updatedBankCard.dataValues);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default updateBankCard;
