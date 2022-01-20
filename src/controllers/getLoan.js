import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function getLoan(req, res) {
  const { id: userId } = req.userData;
  const { loanId } = req.params;

  try {
    const loan = await db.loan.find({
      where: { userId, loanId },
    });

    if (!loan) {
      return respondWithWarning(res, 404, 'Loan request does not exist');
    }
    return respondWithSuccess(res, 200, 'success', loan.toJSON());
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default getLoan;
