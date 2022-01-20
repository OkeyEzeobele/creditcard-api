import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function adminRejectLoan(req, res) {
  try {
    const { loanId } = req.body;

    const loans = await db.loan.findOne({
      where: { id: loanId },
    });

    if (loans) {
      return respondWithWarning(res, 404, 'Loan records not found');
    }

    loans.update({ status: 'completed' });

    return respondWithSuccess(res, 200, 'Loan completed successfully', loans);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminRejectLoan;
