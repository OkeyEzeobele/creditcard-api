import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function adminGetTransactionDetails(req, res) {
  const { txrefId } = req.params;

  try {
    const transaction = await db.transaction.findOne({
      where: { id: txrefId },
    });

    if (!transaction) {
      return respondWithWarning(res, 404, 'Transaction does not exist');
    }

    const user = await db.user.findOne({
      where: { id: transaction.userId },
      attributes: { exclude: ['password'] },
    });

    return respondWithSuccess(res, 200, 'success', {
      transaction, user,
    });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default adminGetTransactionDetails;
