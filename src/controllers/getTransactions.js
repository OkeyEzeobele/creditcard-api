import moment from 'moment';
import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
import BevertecApi from '../api/bevertecApi';
import { parseString } from 'xml2js';
const sequelize = db.sequelize;


function callTransactionHistoryApi(virtualCards, startDate, endDate) {
  return Promise.all(virtualCards.map(async (card) => {
    const { cifNumber } = card;
    const cardDetails = await BevertecApi.getCardDetailsFromCif(cifNumber);
    if (cardDetails && cardDetails.cardnum) {
      const {
        cardnum: cardNum,
      } = cardDetails

      const response = await BevertecApi.transactionHistory(cardNum, startDate, endDate);
      return response.body.postedTransactions;
    } else {
      return {};
    }
    
  }));
}

async function getTransactions(req, res) {
  const { Op } = db.Sequelize;
  let o3Transactions = [];
  let allTransactions = [];
  const defaultStartDate = `${moment().subtract(60, 'day').format('YYYY-MM-DD')}`;
  const defualtEnddate = `${moment().format('YYYY-MM-DD')}`;

  const { id: userId } = req.userData;

  try {
    const now = moment().format('YYYY-MM-DD');
    const virtualCards = await db.O3card.findAll({ where: { userId } });

    if (virtualCards) {
      // o3Transactions = await callTransactionHistoryApi(virtualCards, moment().subtract(2, 'day').format('YYYY-MM-DD'), defualtEnddate);
    }

    const {
      destination = null, startDate = null, endDate = null, id, txref, page = 1, limit = 100
    } = req.query;
    const rLimit = limit || 100;

    const whereClause = {
      userId,
      status: 'completed',
    };

    if (destination) {
      whereClause.destination = destination;
    }

    if (startDate && endDate) {
      whereClause.createdAt = { [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`] };
    } else {
      whereClause.createdAt = { [Op.gt]: `${defaultStartDate} 00:00:00` };
    }

    // const transactions = await db.transaction.findAll({
    //   where: whereClause,
    //   raw: true,
    // });


    let query = `SELECT t.*, bp.recepient, bp.type, ta.bankCode, ta.accountNumber, ta.cifNumber, lo.tenure  from transactions as t`;
    query += ' LEFT JOIN transfers as ta ON (ta.id = t.destId AND t.source = "03Card" AND t.destination IN ("bank", "card"))';
    query += ' LEFT JOIN billpayments as bp ON (bp.id = t.destId AND t.source = "03Card" AND t.destination = "bill")';
    query += ' LEFT JOIN loans as lo ON (lo.id = t.destId AND t.destination = "loan")'; 
    query += ' WHERE t.status = "completed"';

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
    } else {
      query += ` AND t.createdAt >= "${defaultStartDate} 00:00:00"`;
    }
    query += ` ORDER BY t.createdAt DESC LIMIT ${(page) ? (Number(page)-1)*rLimit : 0}, ${limit}`;
    
    console.log(startDate, endDate);

    // console.log(JSON.stringify(o3Transactions));

    // {
    //   "trace": 254501,
    //   "txndate": "2020-12-21",
    //   "postdate": "2020-12-21",
    //   "description": "Purchase",
    //   "cardnum_d": "5066450",
    //   "cardnum": "506124*********6450",
    //   "acctnum": "0001038826566",
    //   "merchantName": "201221001663741853   ",
    //   "merchantCity": null,
    //   "amount": 9999,
    //   "txncode": "200",
    //   "currencyCode": "566",
    //   "currencyDesc": "566-NGN",
    //   "type": "DR",
    //   "org_or_rev": "O",
    //   "transactionStatus": 1,
    //   "referenceCode": "001682583856",
    //   "balance": null,
    //   "term_id": "3IPG0001",
    //   "acctCif": "00003734"
    // },

    // {
    //   "trace": 9421,
    //   "txndate": "2021-02-08",
    //   "postdate": "2021-02-08",
    //   "description": "Balance Inquiry",
    //   "cardnum_d": "506129561",
    //   "cardnum": "506124*********9561",
    //   "acctnum": "000100272566",
    //   "merchantName": "UBA GCB KOFO RIDUA AT",
    //   "merchantCity": null,
    //   "amount": 0,
    //   "txncode": "903",
    //   "currencyCode": "566",
    //   "currencyDesc": "566-NGN",
    //   "type": null,
    //   "org_or_rev": "O",
    //   "transactionStatus": 1,
    //   "referenceCode": "002947155129",
    //   "balance": null,
    //   "term_id": "10331580",
    //   "acctCif": "00010222"
    // },

    // console.log('---',o3Transactions[0].length, o3Transactions[1].length);

    // if (o3Transactions && o3Transactions[0] && o3Transactions[0].length) {
    //   for (let i = 0; i < o3Transactions[0].length; i++) {
    //     const extTxn = o3Transactions[0][i];
  
    //     if (extTxn && extTxn.amount > 0 && ![600,601,603,650,651,810,811,813,903,898,899].includes(extTxn.txncode)) {
    //       // console.log(extTxn);
    //       allTransactions.push({
    //         id: parseInt(`130000${extTxn.trace}`),
    //         userId: 23,
    //         amount: extTxn.amount,
    //         status: (extTxn.transactionStatus == 1) ? 'completed' : 'failed',
    //         fee: 0,
    //         destination: 'external',
    //         comment: `${extTxn.description}/${extTxn.merchantName}`.trim(),
    //         destId: 0,
    //         source: '03Card',
    //         sourceId: 0,
    //         narration: null,
    //         txref: extTxn.referenceCode,
    //         response: null,
    //         createdAt: extTxn.txndate,
    //         updatedAt: extTxn.txndate,
    //         recepient: null,
    //         type: null,
    //         bankCode: null,
    //         accountNumber: null,
    //         cifNumber: extTxn.acctCif,
    //         tenure: null
    //       });
    //     }
    //   }
    // }


    // {
    //   "id": 2278,
    //   "userId": 23,
    //   "amount": "12",
    //   "status": "completed",
    //   "fee": "0",
    //   "destination": "bill",
    //   "comment": "AIRTIME/08068369634",
    //   "destId": "135",
    //   "source": "03Card",
    //   "sourceId": "14",
    //   "narration": null,
    //   "txref": "bill-210194191983",
    //   "response": "{\"status\":\"success\",\"data\":{\"data\":{\"MobileNumber\":\"+2348068369634\",\"Amount\":12,\"Network\":\"MTN\",\"TransactionReference\":\"CF-FLYAPI-20210119040044694099\",\"PaymentReference\":\"BPUSSD16110720454874427483\",\"BatchReference\":null,\"ExtraData\":null,\"Status\":\"success\",\"Message\":\"Bill Payment was completed successfully\",\"Reference\":null}}}",
    //   "createdAt": "2021-01-19T16:00:40.000Z",
    //   "updatedAt": "2021-01-19T16:00:47.000Z",
    //   "recepient": "08068369634",
    //   "type": "AIRTIME",
    //   "bankCode": null,
    //   "accountNumber": null,
    //   "cifNumber": null,
    //   "tenure": null
    // }


    const transactions = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT, replacements: [] });
    const mergedTxns = allTransactions.concat(transactions);

    // console.log(mergedTxns.length);


    return respondWithSuccess(res, 200, 'success', mergedTxns);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default getTransactions;
