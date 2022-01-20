import moment from 'moment';
import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function adminCurrentOpenLoans(req, res) {
  try {
    const { Op } = db.Sequelize;

    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    const loans = await db.loan.findAll({
      where: {
        status: 'pending',
        createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
      },
    });

    return respondWithSuccess(res, 200, 'success', loans);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminCurrentOpenLoans;
