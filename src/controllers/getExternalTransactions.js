import db from '../db';
import BevertecApi from '../api/bevertecApi';
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import { result } from 'lodash';
import e from 'express';


const getExternalApi = async (req, res) => {
  try {
    console.log(req.body)
    const response = await BevertecApi.transactionHistory(req.body.cardNum, req.body.startDate, req.body.endDate);


    if (response) {
      console.log(response.body.postedTransactions)
      let result = response.body.postedTransactions;
      let transactions = result.filter(responses => responses.txncode !== '600' && 
        responses.txncode !== '601' && 
        responses.txncode !== '603' && 
        responses.txncode !== '650' && 
        responses.txncode !== '651' && 
        responses.txncode !== '810' && 
        responses.txncode !== '811' && 
        responses.txncode !== '813' && 
        responses.txncode !== '903' && 
        responses.txncode !== '898' && 
        responses.txncode !== '899'
      )
      //console.log(result)
      return respondWithSuccess(res, 200, 'success', transactions)
    };


  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e
    });
    return respondWithWarning(res, 500, 'An error Occured');
  }
}



const getCIFUserCardId = function (externalTransactions) {
  console.log(externalTransactions)
  const cifs = [];
  const response = {};


  externalTransactions.payload.foreach((txn) => {
    cifs.push(txn.acctCif)
  });

  let sequelize = `SELECT id, userId, cifNumber from 03card WHERE cifNumber IN ${cifs}`;
  db.query(sequelize, function (err, result) {
    if (err) throw err;
    //console.log(result)


    //const result = [ {id: 1, userId: 1, cifNumber: 00004324},  {id: 2, userId: 44, cifNumber: 00004443},  {id: 33, userId: 21, cifNumber: 00003369} ]; 
    result.foreach((res) => {
      response[res.cifNumber] = res;
    })
  })

}


function prepareExtTxnForSave(externalTransactions, cifTracker) {
  const bulkTxnsFormatted = [];

  externalTransactions.payload.foreach((txn) => {
    bulkTxnsFormatted.push({
      userId: cifTracker[txn.acctCif].userId,
      amount: txn.amount,
      status: (txn.transactionStatus == 1) ? 'completed' : 'pending',
      fee: 0,
      extFee: null,
      destination: "external",
      destId: 0,
      source: "03Card",
      sourceId: cifTracker[txn.acctCif].id,
      comment: `${txn.description} ${txn.merchantName}`,
      narration: txn.merchantName,
      txref: txn.referenceCode,
      response: null,
      createdAt: txn.txndate,
      updatedAt: txn.txndate
    })
  })

  let sequelize = `INSERT into transactions { userId, amount, status, fee, extFee, destination, destId, sourceId, comment, narration, txref, response, createdAt, updatedAt} VALUE ${bulkTxnsFormatted}`;
  db.query(sequelize, function (err, result) {
    if (err) throw err;
    //console.log(result)

    return `${externalTransactions.payload.length} new transactions saved to DB`
  })

}



const getExternalTransactions = async(req, res)=> {
  try{
  const extTxnAPIResp = await getExternalApi(req, res);
  const getCIFtracker = getCIFUserCardId(extTxnAPIResp);
  const saveToDB = prepareExtTxnForSave(extTxnAPIResp, getCIFtracker);
  return saveToDB
  } catch(err){
    return err
  }
}


export default getExternalTransactions
