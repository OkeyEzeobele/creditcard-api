import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
import { exportCsv } from '../helpers/tools';

async function adminFetchCustomers(req, res) {
  try {
    const {
      offset, limit, userId, page, email, bvn, phone, download
    } = req.query;

    const whereOption = {};
    const rLimit = limit || 100;

    if (userId) {
      whereOption.id = userId;
    }

    if (email) {
      whereOption.email = email;
    }

    if (bvn) {
      whereOption.bvn = bvn;
    }

    if (phone) {
      whereOption.phone = phone;
    }

    const customers = await db.user.findAndCountAll({
      attributes: { exclude: ['password'] },
      offset: (page) ? (Number(page)-1)*rLimit : 0,
      limit: Number(limit) || 10,
      where: { ...whereOption },
      order: [['createdAt', 'DESC']],
    });

    if (download) {
      const file = await exportCsv({ key: 'customers', value: customers });

      response = {
        status: 'success',
        file: `${process.env.APP_HOSTNAME || req.get('host')}/api/v1/admin-download/${file}`,
      };
    }

    return respondWithSuccess(res, 200, 'success', {...customers, limit: rLimit});
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

async function customerDetail(req, res) {
  try {
    const { Op } = db.Sequelize;

    const whereOption = {};

    const user = await db.user.findOne({
      attributes: { exclude: ['password', 'spin', 'resetToken', 'pushToken', 'deviceId'] },
      where: { id: req.params.id },
      raw: true
    });

    const address = await db.addressInfo.findOne({
      where: { userId: req.params.id },
      raw: true
    });

    const personal = await db.personalInfo.findOne({
      where: { userId: req.params.id },
      raw: true
    });

    const employer = await db.employerInfo.findOne({
      where: { userId: req.params.id },
      raw: true
    });

    const document = await db.document.findAll({
      where: { userId: req.params.id },
      raw: true
    });

    const revision = await db.revision.findOne({
      where: { userId: req.params.id },
      raw: true
    });



    return respondWithSuccess(res, 200, 'success', { user, address, personal, employer, document, revision });
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export { adminFetchCustomers, customerDetail };
