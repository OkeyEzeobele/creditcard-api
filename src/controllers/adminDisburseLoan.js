import db from '../db';
import { respondWithWarning } from '../helpers/httpResponse';
import logger from '../helpers/logger';

import disburseLoanToUser from '../api/loanApi';

async function adminApproveLoan(req, res) {
  try {
    const { loanId } = req.body;

    const loan = await db.loan.findOne({
      where: { id: loanId, status: 'approved', disbursed: false },
    });

    if (!loan) {
      return respondWithWarning(res, 404, 'Loan record not found');
    }

    const transaction = await db.transaction.findOne({
      where: { sourceId: loan.id, source: 'loan' },
    });

    if (!transaction) {
      return respondWithWarning(res, 404, 'Transaction records not found');
    }

    return await disburseLoanToUser(res, loan, transaction);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminApproveLoan;
