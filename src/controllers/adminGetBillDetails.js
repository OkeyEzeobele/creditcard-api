import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function adminGetBillDetails(req, res) {
  const { billId } = req.params;

  try {
    const bill = await db.billpayment.findOne({
      where: { id: billId },
    });

    if (!bill) {
      return respondWithWarning(res, 404, 'Bill request does not exist');
    }

    const user = await db.user.findOne({
      where: { id: bill.userId },
      attributes: { exclude: ['password'] },
    });

    return respondWithSuccess(res, 200, 'success', {
      bill, user,
    });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default adminGetBillDetails;
