import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
import { exportCsv } from '../helpers/tools';
import BevertecApi from '../api/bevertecApi';

async function fetchCards(req, res) {
  try {
    const {
      cifNumber, userId, type, email, phone, startDate, endDate, offset, limit, page, download,
    } = req.query;

    const rLimit = limit || 100;
    let query = `SELECT u.email, u.phone, u.fullName, c.id, c.first6, c.last4, c.cifNumber, c.appNumber, c.acctNumber, c.createdAt,
    c.orderLabel, c.type, c.balance 
    FROM O3cards as c
    JOIN users as u on u.id = c.userId WHERE c.id is not null`;
    const query2 = 'SELECT count(c.id) as count from O3cards as c JOIN users as u on u.id = c.userId';

    // const whereOption = Object.assign({}, status !== 'all' && { status });

    if (cifNumber) {
      query += ` AND c.cifNumber = "${cifNumber}"`;
    }
    if (type) {
      query += ` AND c.type = "${type}"`;
    }
    if (userId) {
      query += ` AND c.userId = "${userId}"`;
    }
    if (email) {
      query += ` AND u.email = "${email}"`;
    }
    if (phone) {
      query += ` AND u.phone = "${phone}"`;
    }
    if (startDate && endDate) {
      query += ` AND c.createdAt between "${startDate} 00:00:00" and "${endDate} 23:59:59"`;
    } else if (startDate) {
      query += ` AND c.createdAt between "${startDate} 00:00:00" and "${startDate} 23:59:59"`;
    }

    query += ` ORDER BY c.createdAt DESC LIMIT ${(page) ? (Number(page) - 1) * rLimit : 0}, ${limit}`;
    const cards = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT, replacements: [] });
    const countCards = await db.sequelize.query(query2, { type: db.sequelize.QueryTypes.SELECT, replacements: [] });

    let response = { rows: cards, limit: rLimit, count: countCards[0].count };

    if (download) {
      const file = await exportCsv({ key: 'cards', value: cards });

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


async function cardDetail(req, res) {
  try {
    const { Op } = db.Sequelize;

    const whereOption = {};
    whereOption.id = req.params.id;

    const card = await db.O3card.findOne({
      attributes: { exclude: ['cardHash', 'virtual', 'updatedAt'] },
      where: { ...whereOption },
      raw: true,
    });

    const { cifNumber, acctNumber } = card;
    const balance = await BevertecApi.fetchBalance(cifNumber, acctNumber);

    console.log(balance);

    // card.update({ balance });

    return respondWithSuccess(res, 200, 'success', card);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}


async function cardBalance(req, res) {
  // try {
  //   const resp = await BevertecApi.fetchBalance(req.body.cifNumber, req.body.acctNumber);
  //   return respondWithSuccess(res, 200, 'success', resp);
  // } catch (error) {
  //   logger.error({
  //     message: 'An Error occurred',
  //     error,
  //   });
  //   return respondWithWarning(res, 500, 'An Error occurred');
  // }
}


async function cardQuery(req, res) {
  try {
    const card = await db.O3card.findOne({ where: { cifNumber: req.body.cifNumber } });
    const resp = await BevertecApi.getCardDetailsFromCif(req.body.cifNumber);

    if (resp && resp.cardnum && resp.cardnum.slice(-4) !== card.last4) {
      card.update({ first6: resp.cardnum.slice(0, 6), last4: resp.cardnum.slice(-4) });
    }

    return respondWithSuccess(res, 200, 'success', resp);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}


async function cardState(req, res) {
  try {
    const { cardnum: cardNumber } = await BevertecApi.getCardDetailsFromCif(req.body.cifNumber);
    const resp = await BevertecApi.setCardStatus(req.body.cifNumber, cardNumber, req.body.statusCode);
    return respondWithSuccess(res, 200, 'success', resp);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}


async function fetchCardRequest (req, res) {
  try {
    const { Op } = db.Sequelize;

    const {
      userId, status, startDate, endDate, offset, limit, page, download
    } = req.query;

    const whereOption = {};
    const rLimit = limit || 100;

    if (userId) {
      whereOption.userId = userId;
    }

    if (status) {
      whereOption.status = status;
    } else {
      whereOption.status = 'pending';
    }

    if (startDate && endDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`] };
    } else if (startDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${startDate} 23:59:59`] };
    }

    const cards = await db.ccrequest.findAndCountAll({
      offset: (page) ? (Number(page)-1)*rLimit : 0,
      limit: Number(limit) || 100,
      where: { ...whereOption },
      order: [['createdAt', 'DESC']],
    });
    if (download) {
      const file = await exportCsv({ key: 'cards', value: cards });

      response = {
        status: 'success',
        file: `${process.env.APP_HOSTNAME || req.get('host')}/api/v1/admin-download/${file}`,
      };
    }

    return respondWithSuccess(res, 200, 'success', {...cards, limit: rLimit});
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

async function fetchApprovedRequest (req, res) {
  try {
    const { Op } = db.Sequelize;

    const {
      userId, status, startDate, endDate, offset, limit, page, download
    } = req.query;

    const whereOption = {};
    const rLimit = limit || 100;

    if (userId) {
      whereOption.userId = userId;
    }

    if (status) {
      whereOption.status = status;
    } else {
      whereOption.status = 'disbursed';
    }

    if (startDate && endDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`] };
    } else if (startDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${startDate} 23:59:59`] };
    }

    const cards = await db.ccrequest.findAndCountAll({
      offset: (page) ? (Number(page)-1)*rLimit : 0,
      limit: Number(limit) || 100,
      where: { ...whereOption },
      order: [['createdAt', 'DESC']],
    });

    if (download) {
      const file = await exportCsv({ key: 'cards', value: cards });

      response = {
        status: 'success',
        file: `${process.env.APP_HOSTNAME || req.get('host')}/api/v1/admin-download/${file}`,
      };
    }

    return respondWithSuccess(res, 200, 'success', {...cards, limit: rLimit});
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

async function fetchRejectedRequest (req, res) {
  try {
    const { Op } = db.Sequelize;

    const {
      userId, status, startDate, endDate, offset, limit, page, download
    } = req.query;

    const whereOption = {};
    const rLimit = limit || 100;

    if (userId) {
      whereOption.userId = userId;
    }

    if (status) {
      whereOption.status = status;
    } else {
      whereOption.status = 'rejected';
    }

    if (startDate && endDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`] };
    } else if (startDate) {
      whereOption.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${startDate} 23:59:59`] };
    }

    const cards = await db.ccrequest.findAndCountAll({
      offset: (page) ? (Number(page)-1)*rLimit : 0,
      limit: Number(limit) || 100,
      where: { ...whereOption },
      order: [['createdAt', 'DESC']],
    });

    if (download) {
      const file = await exportCsv({ key: 'cards', value: cards });

      response = {
        status: 'success',
        file: `${process.env.APP_HOSTNAME || req.get('host')}/api/v1/admin-download/${file}`,
      };
    }
    
    return respondWithSuccess(res, 200, 'success', {...cards, limit: rLimit});
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}


export { fetchCards, cardDetail, cardBalance, cardQuery, cardState, fetchCardRequest, fetchApprovedRequest,fetchRejectedRequest};
