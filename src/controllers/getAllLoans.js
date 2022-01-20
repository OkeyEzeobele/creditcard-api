import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function getAllLoans(req, res) {
  const { id: userId } = req.userData;

  try {
    const loans = await db.loan.findAll({
      where: { userId },
    });

    if (!loans.length) {
      return respondWithWarning(res, 404, 'Loan requests not found');
    }
    return respondWithSuccess(res, 200, 'success', loans);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default getAllLoans;
