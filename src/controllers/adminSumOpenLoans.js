import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function adminSumOpenLoans(req, res) {
  try {
    const { sequelize } = db;
    const loans = await db.loan.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'amount']],
      where: {
        status: 'pending',
      },
    });

    return respondWithSuccess(res, 200, 'success', loans[0].dataValues);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminSumOpenLoans;
