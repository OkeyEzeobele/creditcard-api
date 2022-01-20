import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function checkTransactionStatus(req, res) {
  const { id: userId } = req.userData;
  const { txref } = req.query;

  try {
    const transaction = await db.transaction.findOne({
      where: { userId, txref },
    });

    if (!transaction) {
      return respondWithWarning(res, 404, 'Transaction not found');
    }

    if (transaction.status) {
      return respondWithWarning(res, 401, 'Transaction already completed');
    }

    return respondWithSuccess(res, 200, 'Transaction still pending', { txref });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default checkTransactionStatus;
