import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
import { exportCsv } from '../helpers/tools';

async function adminFetchLoans(req, res) {
  try {
    const { Op } = db.Sequelize;

    const {
      status = 'all', offset, limit, amount, userId, startDate, endDate, download
    } = req.query;

    const rLimit = limit || 100;
    const query2 = 'SELECT count(c.id) as count from loans as c JOIN users as u on u.id = c.userId';
    const whereOption = Object.assign({},
      status !== 'all' && { status });

    if (amount) {
      whereOption.amount = amount;
    }
    if (userId) {
      whereOption.userId = userId;
    }

    if (startDate && endDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`] };
    } else if (startDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${startDate} 23:59:59`] };
    }
    const countLoans = await db.sequelize.query(query2, { type: db.sequelize.QueryTypes.SELECT, replacements: [] });
    const loans = await db.loan.findAll({
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      where: { ...whereOption },
      order: [['createdAt', 'DESC']],
    });
    let response ={rows: loans, limit:rLimit, count: countLoans[0].count}
    // if (!loans.length) {
    //   return respondWithWarning(res, 404, 'Loan records not found');
    // }



    if (download) {
      const file = await exportCsv({ key: 'loans', value: loans });

      response = {
        status: 'success',
        file: `${process.env.APP_HOSTNAME || req.get('host')}/api/v1/admin-download/${file}`,
      };
    }

    return respondWithSuccess(res, 200, 'success', response);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminFetchLoans;
