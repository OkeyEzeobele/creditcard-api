import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
import disburseLoanToUser from '../api/loanApi';
import { isAutoDisburseActive } from '../helpers/config';

async function adminApproveLoan(req, res) {
  try {
    const { loanId } = req.body;

    const loan = await db.loan.findOne({
      where: { id: loanId, status: 'pending' },
    });

    if (!loan) {
      return respondWithWarning(res, 404, 'Loan records not found');
    }

    const transaction = await db.transaction.findOne({
      where: { sourceId: loan.id, source: 'loan' },
    });

    if (!transaction) {
      return respondWithWarning(res, 404, 'Transaction records not found');
    }

    transaction.update({ status: 'completed' });

    loan.update({ status: 'approved' });

    if (await isAutoDisburseActive()) {
      return await disburseLoanToUser(res, loan, transaction);
    }

    return respondWithSuccess(res, 200, 'Loan approved successfully');
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminApproveLoan;
