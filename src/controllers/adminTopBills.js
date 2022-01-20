import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function adminTopBills(req, res) {
  try {
    const { QueryTypes } = db.Sequelize;

    const result = await db.sequelize.query('SELECT type, sum(`amount`) as total, COUNT(*) as count FROM `billpayments` WHERE MONTH(`createdAt`) = MONTH(CURRENT_DATE()) and YEAR(`createdAt`) = YEAR(CURRENT_DATE()) GROUP BY(`type`) ORDER BY total DESC LIMIT 3', { type: QueryTypes.SELECT });

    return respondWithSuccess(res, 200, 'success', result);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminTopBills;
