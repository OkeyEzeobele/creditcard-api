import cryptoRandomString from 'crypto-random-string';
import { verifyPassword, padString } from '../helpers/passwordEncryption';

import db from '../db';
import BevertecApi from '../api/bevertecApi';


// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
import generateO3cardTxRef from '../helpers/generateO3cardTxRef';
import moneywave from '../api/moneywave';
import winston from 'winston';

async function requestTransfer(req, res) {
  const { id: userId } = req.userData;
  const {
    amount,
    recepient,
    bankCode,
    accountNumber,
    cifNumber: cif,
    cardId,
    pin,
    narration,
  } = req.body;
  const cifNumber = padString('0', 8, cif);

  try {
    const user = await db.user.findOne({ where: { id: userId } });
    if (!user) { return respondWithWarning(res, 401, 'Invalid Authorization token'); }
    if (!verifyPassword(pin, user.spin)) { return respondWithWarning(res, 403, 'Invalid Security PIN'); }
  } catch (error) {
    logger.error({ message: 'SPIN failure', error, });
    return respondWithWarning(res, 500, 'An Error Occured'); 
  }


  if (recepient === 'bank' && (!accountNumber && !bankCode)) {
    return respondWithWarning(res, 400, 'Provide accountNumber and bankCode to transfer into');
  }

  if (recepient === 'card' && !cifNumber) {
    return respondWithWarning(res, 400, 'Provide cifNumber to transfer into');
  }

  try {
    const card = await db.O3card.findOne({
      where: { id: cardId, userId },
    });

    if (!card) {
      return respondWithWarning(res, 404, 'Card not found');
    }

    const txref = (recepient === 'bank') ? `RAV-${cryptoRandomString({ length: 20 })}` : generateO3cardTxRef();

    const newTransfer = await db.transfer.create({
      userId,
      amount: Math.abs(amount),
      bankCode,
      accountNumber,
      cifNumber,
      status: 'created',
    });

    const txRef = generateO3cardTxRef();
    let transferType = 'TRANSFER';

    if (recepient === 'bank') transferType = `TRANSFERBANK/${accountNumber}`;
    if (recepient === 'card') transferType = `TRANSFERO3/${cifNumber}`;

    // let fee = 50;
    // if (amount < 10000) fee = 25;
    // let debitCardAmount = amount + fee;

    let fee = 0;
    let externalfee = 0;
    let debitCardAmount = 0;



     if (recepient === 'bank') {
      // fee = Math.round((1.32/100) * amount);
      // if (fee > 2000) { fee = 2000; }

      if (amount < 5000) externalfee = 10;
      else if (amount < 50000) externalfee = 25;
      else externalfee = 50;
     }

     debitCardAmount = amount + fee + externalfee;



    const transaction = await db.transaction.create({
      userId,
      amount,
      fee,
      extfee: externalfee,
      destination: recepient,
      destId: newTransfer.id,
      source: '03Card',
      sourceId: cardId,
      txref,
      narration,
    });



    const debitCardResponse = await BevertecApi.debitCard(card.cifNumber, debitCardAmount, txRef, 'TRANSFERBANK');
    if (!(debitCardResponse.body.data.respCode === '00')) {
      transaction.update({ status: 'failed', response: JSON.stringify(debitCardResponse.body.data) });
      return respondWithWarning(res, 409, debitCardResponse.body.data.respMsg);
    } else (
      transaction.update({response: JSON.stringify(debitCardResponse.body.data) })
    );



    if (recepient === 'bank') {
      const resolveResp = await moneywave.resolveAccount(accountNumber, bankCode);
      if (resolveResp.status !== 'success') {
        return respondWithWarning(res, 404, 'Invalid bank details');
      }

      const transferDisburse = await moneywave.disburse({
        ref: txref,
        amount,
        currency: 'NGN',
        bankcode: bankCode,
        accountNumber,
        lock: process.env.MONEY_WAVE_LOCK,
        narration,
      });

      if (transferDisburse.body.status === 'success') {
        transaction.update({ status: 'completed', comment: `TRF-${resolveResp.data.account_name}`, response: JSON.stringify(transferDisburse.body.data) });

        newTransfer.update({ status: 'completed' });
        return respondWithSuccess(res, 200, 'Transfer successful');
      }

      if (transferDisburse.body.status === 'error'
        && (transferDisburse.body.code === 'DUPLICATE_REF'
        || transferDisburse.body.code === 'POSSIBLE_DUPLICATE')) {
        return respondWithWarning(res, 409, transferDisburse.body.message);
      }
      else if (transferDisburse.body.status === 'error') {
        transaction.update({ status: 'failed', comment: `TRF-${resolveResp.data.account_name}`, response: JSON.stringify(transferDisburse.body.data) });

        return respondWithWarning(res, 404, transferDisburse.body.message);
      }

    }
    if (recepient === 'card') {
      // const resolveResp = await BevertecApi.resolveCIF(cifNumber);
      // console.log(resolveResp);

      // if (resolveResp.status !== 'success') {
      //   return respondWithWarning(res, 404, 'Invalid bank details');
      // }

      // const recvTransaction = await db.transaction.create({
      //   userId, // beneficiary
      //   amount,
      //   fee: 0,
      //   destination: '03Card',
      //   destId: newTransfer.id,
      //   source: '03Card',
      //   sourceId: cardId,
      //   txref: `${txref}-2`,
      // });

      const transferDisburse = await BevertecApi.creditCard(cifNumber, amount, txref);

      if (transferDisburse.body.data.respCode === '00') {
        transaction.update({ status: 'completed', comment: `SEND-${cifNumber}`, response: JSON.stringify(transferDisburse.body) });
        newTransfer.update({ status: 'completed' });
        return respondWithSuccess(res, 200, 'Transfer successful');
      } else if (transferDisburse && transferDisburse.body && transferDisburse.body.data) {
        transaction.update({ status: 'failed', comment: `SEND-${cifNumber}`, response: JSON.stringify(transferDisburse.body.data) });
        return respondWithWarning(res, 409, transferDisburse.body.data.respMsg);
      }
    }
    transaction.update({response: JSON.stringify(debitCardResponse.body)  });
    return respondWithWarning(res, 500, 'Transfer failed, Error occurred, contact admin to resolve');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default requestTransfer;
