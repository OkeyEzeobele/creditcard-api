import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function adminFetchBills(req, res) {
  try {
    const { Op } = db.Sequelize;

    const {
      status = 'all', offset, limit, amount, userId, startDate, endDate, type,
    } = req.query;

    const whereOption = Object.assign({},
      status !== 'all' && { status });

    if (amount) {
      whereOption.amount = amount;
    }
    if (userId) {
      whereOption.userId = userId;
    }
    if (type) {
      whereOption.type = type;
    }
    if (startDate && endDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`] };
    } else if (startDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${startDate} 23:59:59`] };
    }

    const bills = await db.billpayment.findAll({
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      where: { ...whereOption },
      order: [['createdAt', 'DESC']],
    });

    return respondWithSuccess(res, 200, 'success', bills);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminFetchBills;
