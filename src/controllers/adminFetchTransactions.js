import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
const sequelize = db.sequelize;
import { exportCsv } from '../helpers/tools';

async function adminFetchTransactions(req, res) {
  try {
    const { Op } = db.Sequelize;

    const {
      status = 'all', offset, limit, userId, startDate, endDate, txref, page, id, download
    } = req.query;

    const rLimit = limit || 100;
    let query = `SELECT t.*, u.email, u.phone, u.fullName from transactions as t JOIN users as u on u.id = t.userId WHERE t.id is not null`
    const query2 = `SELECT count(t.id) as count from transactions as t JOIN users as u on u.id = t.userId`

    // const whereOption = Object.assign({}, status !== 'all' && { status });

    if (id) {
      query += ` AND t.id = ${id}`;
    }
    if (txref) {
      query += ` AND t.txref = ${txref}`;
    }
    if (userId) {
      query += ` AND t.userId = ${userId}`;
    }
    if (startDate && endDate) {
      query += ` AND t.createdAt between "${startDate} 00:00:00" and "${endDate} 23:59:59"`;
    } else if (startDate) {
      query += ` AND t.createdAt between "${startDate} 00:00:00" and "${startDate} 23:59:59"`;
    }

    query += ` ORDER BY t.createdAt DESC LIMIT ${(page) ? (Number(page)-1)*rLimit : 0}, ${limit}`;
    const transactions = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT, replacements: [] });
    const countTxn = await sequelize.query(query2, { type: sequelize.QueryTypes.SELECT, replacements: [] });
    // console.log(transactions)
    
    // const transactions = await db.transaction.findAndCountAll({
    //   offset: (page) ? (Number(page)-1)*rLimit : 0,
    //   limit: Number(limit) || 10,
    //   where: { ...whereOption },
    //   order: [['createdAt', 'DESC']],
    // });

    if (download) {
      const file = await exportCsv({ key: 'transactions', value: transactions });

      response = {
        status: 'success',
        file: `${process.env.APP_HOSTNAME || req.get('host')}/api/v1/admin-download/${file}`,
      };
    }
    // console.log(transactions)
    return respondWithSuccess(res, 200, 'success', { rows: transactions, limit: rLimit, count: countTxn[0].count });
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}
async function adminFetchBankTransactions(req, res) {
  try {
    const { Op } = db.Sequelize;

    const {
      status = 'all', offset, limit, userId, startDate, endDate, txref, page, id, download
    } = req.query;

    const rLimit = limit || 100;
    let query = `SELECT t.*, u.email, u.phone, u.fullName from transactions as t JOIN users as u on u.id = t.userId WHERE t.id is not null`
    const query2 = `SELECT count(t.id) as count from transactions as t JOIN users as u on u.id = t.userId`

    // const whereOption = Object.assign({}, status !== 'all' && { status });

    if (id) {
      query += ` AND t.id = ${id}`;
    }
    if (txref) {
      query += ` AND t.txref = ${txref}`;
    }
    if (userId) {
      query += ` AND t.userId = ${userId}`;
    }
    if (startDate && endDate) {
      query += ` AND t.createdAt between "${startDate} 00:00:00" and "${endDate} 23:59:59"`;
    } else if (startDate) {
      query += ` AND t.createdAt between "${startDate} 00:00:00" and "${startDate} 23:59:59"`;
    }

    query += ` ORDER BY t.createdAt DESC LIMIT ${(page) ? (Number(page)-1)*rLimit : 0}, ${limit}`;
    let results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT, replacements: [] });
    const countTxn = await sequelize.query(query2, { type: sequelize.QueryTypes.SELECT, replacements: [] });
    //console.log(results)
    
    const transactions = results.filter(result => result.destination === 'bank');

    if (download) {
      const file = await exportCsv({ key: 'transactions', value: transactions });

      response = {
        status: 'success',
        file: `${process.env.APP_HOSTNAME || req.get('host')}/api/v1/admin-download/${file}`,
      };
    }

    return respondWithSuccess(res, 200, 'success', { rows: transactions, limit: rLimit, count: countTxn[0].count });
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

async function adminFetchO3Transactions(req, res) {
  try {
    const { Op } = db.Sequelize;

    const {
      status = 'all', offset, limit, userId, startDate, endDate, txref, page, id, download
    } = req.query;

    const rLimit = limit || 100;
    let query = `SELECT t.*, u.email, u.phone, u.fullName from transactions as t JOIN users as u on u.id = t.userId WHERE t.id is not null`
    const query2 = `SELECT count(t.id) as count from transactions as t JOIN users as u on u.id = t.userId`

    // const whereOption = Object.assign({}, status !== 'all' && { status });

    if (id) {
      query += ` AND t.id = ${id}`;
    }
    if (txref) {
      query += ` AND t.txref = ${txref}`;
    }
    if (userId) {
      query += ` AND t.userId = ${userId}`;
    }
    if (startDate && endDate) {
      query += ` AND t.createdAt between "${startDate} 00:00:00" and "${endDate} 23:59:59"`;
    } else if (startDate) {
      query += ` AND t.createdAt between "${startDate} 00:00:00" and "${startDate} 23:59:59"`;
    }

    query += ` ORDER BY t.createdAt DESC LIMIT ${(page) ? (Number(page)-1)*rLimit : 0}, ${limit}`;
    let results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT, replacements: [] });
    const countTxn = await sequelize.query(query2, { type: sequelize.QueryTypes.SELECT, replacements: [] });
    
    const transactions = results.filter(result => result.destination === '03Card');

    if (download) {
      const file = await exportCsv({ key: 'transactions', value: transactions });

      response = {
        status: 'success',
        file: `${process.env.APP_HOSTNAME || req.get('host')}/api/v1/admin-download/${file}`,
      };
    }

    return respondWithSuccess(res, 200, 'success', { rows: transactions, limit: rLimit, count: countTxn[0].count });
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}


async function adminFetchBills(req, res) {
  try {
    const { Op } = db.Sequelize;

    const {
      status = 'all', offset, limit, userId, startDate, endDate, txref, page, id, download
    } = req.query;

    const rLimit = limit || 100;
    let query = `SELECT t.*, u.email, u.phone, u.fullName from transactions as t JOIN users as u on u.id = t.userId WHERE t.id is not null`
    const query2 = `SELECT count(t.id) as count from transactions as t JOIN users as u on u.id = t.userId`

    // const whereOption = Object.assign({}, status !== 'all' && { status });

    if (id) {
      query += ` AND t.id = ${id}`;
    }
    if (txref) {
      query += ` AND t.txref = ${txref}`;
    }
    if (userId) {
      query += ` AND t.userId = ${userId}`;
    }
    if (startDate && endDate) {
      query += ` AND t.createdAt between "${startDate} 00:00:00" and "${endDate} 23:59:59"`;
    } else if (startDate) {
      query += ` AND t.createdAt between "${startDate} 00:00:00" and "${startDate} 23:59:59"`;
    }

    query += ` ORDER BY t.createdAt DESC LIMIT ${(page) ? (Number(page)-1)*rLimit : 0}, ${limit}`;
    let results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT, replacements: [] });
    const countTxn = await sequelize.query(query2, { type: sequelize.QueryTypes.SELECT, replacements: [] });
    // console.log(results)
    
    const transactions = results.filter((result) => {return result.destination === 'bill'});

    if (download) {
      const file = await exportCsv({ key: 'transactions', value: transactions });

      response = {
        status: 'success',
        file: `${process.env.APP_HOSTNAME || req.get('host')}/api/v1/admin-download/${file}`,
      };
    }

    return respondWithSuccess(res, 200, 'success', { rows: transactions, limit: rLimit, count: countTxn[0].count });
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}



export {adminFetchTransactions, adminFetchBankTransactions, adminFetchO3Transactions, adminFetchBills}
