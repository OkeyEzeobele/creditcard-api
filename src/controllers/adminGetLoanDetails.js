import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function adminGetLoanDetails(req, res) {
  const { loanId } = req.params;

  try {
    const loan = await db.loan.findOne({
      where: { id: loanId },
    });

    if (!loan) {
      return respondWithWarning(res, 404, 'Loan request does not exist');
    }

    const user = await db.user.findOne({
      where: { id: loan.userId },
      attributes: { exclude: ['password'] },
    });

    const creditscore = await db.creditscore.findOne({
      where: { userId: loan.userId, loanId: loan.id },
    });

    return respondWithSuccess(res, 200, 'success', {
      loan, user, creditscore,
    });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default adminGetLoanDetails;
