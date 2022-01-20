import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function createBankCard(req, res) {
  const { id: userId } = req.userData;
  const bankCardDetails = { ...req.body, userId };

  try {
    const bankCardInfo = await db.bankcard.find({ where: { userId } });
    if (bankCardInfo) {
      return respondWithWarning(res, 409, 'Bank Card Information already created');
    }
    const newBankcard = await db.bankcard.create(bankCardDetails);

    return respondWithSuccess(res, 201, 'Bank Card Information Created Successfully', newBankcard.dataValues);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default createBankCard;
