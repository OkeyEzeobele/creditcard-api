import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function adminTopTransactions(req, res) {
  try {
    const { QueryTypes } = db.Sequelize;

    const result = await db.sequelize.query('SELECT sum(`amount`) as total, COUNT(*) as count FROM `transactions` WHERE MONTH(`createdAt`) = MONTH(CURRENT_DATE()) and YEAR(`createdAt`) = YEAR(CURRENT_DATE())', { type: QueryTypes.SELECT });

    return respondWithSuccess(res, 200, 'success', result);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminTopTransactions;
