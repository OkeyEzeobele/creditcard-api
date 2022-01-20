import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function adminFetchAdmins(req, res) {
  try {
    const {
      offset, limit, userId,
    } = req.query;

    const whereOption = {};

    if (userId) {
      whereOption.id = userId;
    }

    const admins = await db.admin.findAll({
      attributes: { exclude: ['password'] },
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      where: { ...whereOption },
      // order: [['createdAt', 'DESC']],
    });

    return respondWithSuccess(res, 200, 'success', admins);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminFetchAdmins;
