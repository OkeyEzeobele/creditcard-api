import cryptoRandomString from 'crypto-random-string';
import unirest from 'unirest';

import db from '../db';

// helpers
import generateO3cardTxRef from '../helpers/generateO3cardTxRef';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function requestLoan(req, res) {
  let card;
  const { id: userId } = req.userData;
  const {
    amount,
    paymentType,
    bankCode,
    accountNumber,
    cardNumber,
    tenure,
    cardId,
  } = req.body;
  const txref = `RAV-${cryptoRandomString({ length: 20 })}`;

  if (paymentType === 'bank' && (!accountNumber && !bankCode)) {
    return respondWithWarning(res, 400, 'Provide accountNumber and bankCode to disburse');
  }

  if (paymentType === 'card' && !cardNumber) {
    return respondWithWarning(res, 400, 'Provide 03Card to disburse funds');
  }

  try {
    const loan = await db.loan.findOne({
      where: { userId, status: { in: ['created', 'pending', 'approved'] } },
    });

    if (loan) {
      return respondWithWarning(res, 400, 'You already requested for a Loan');
    }

    // if (cardId) {
    //   card = await db.bankcard.findOne({
    //     where: { id: cardId, userId },
    //   });

    //   if (!card) {
    //     return respondWithWarning(res, 404, 'Card not found');
    //   }
    // }

    const fee = '0';

    const newLoan = await db.loan.create({
      userId,
      amount,
      status: 'created',
      disbursed: false,
      paymentType,
      bankCode,
      accountNumber,
      cardNumber,
      tenure,
    });

    const transaction = await db.transaction.create({
      userId,
      amount,
      fee,
      destination: 'loan',
      destId: newLoan.id,
      source: '0',
      sourceId: '0',
      txref,
    });

    // if (card) {
    //   const url = process.env.RAVE_CHARGE_WITH_TOKEN;
    //   const { email } = await db.user.find({
    //     attributes: ['email'],
    //     where: { id: userId },
    //   });
    //   const personalInfo = await db.personalInfo.find({ where: { userId } });
    //   if (!personalInfo) {
    //     return respondWithWarning(res, 404, 'Personal Information not found please fill out your personal Information.');
    //   }
    //   const {
    //     firstName,
    //     lastName,
    //   } = personalInfo;
    //   const response = await unirest.post(url)
    //     .headers({
    //       'Content-Type': 'application/json',
    //     }).send({
    //       txRef: txref,
    //       SECKEY: process.env.RAVE_SECKEY_KEY,
    //       token: card.embedToken,
    //       currency: 'NGN',
    //       country: 'NG',
    //       amount: 10,
    //       email,
    //       firstname: firstName,
    //       lastname: lastName,
    //     });
    //   if (response.body.status === 'success') {
    //     transaction.update({ status: 'completed', response: JSON.stringify(response.body.data) });
    //     newLoan.update({ status: 'pending' });
    //     await db.transaction.create({
    //       userId: newLoan.userId,
    //       amount: newLoan.amount,
    //       fee: 0,
    //       destination: newLoan.paymentType,
    //       destId: '0',
    //       source: 'loan',
    //       sourceId: newLoan.id,
    //       txref: (newLoan.paymentType === 'card') ? generateO3cardTxRef() : `RAV-${cryptoRandomString({ length: 20 })}`,
    //     });
    //     return respondWithSuccess(res, 200, 'Loan request submitted successfully');
    //   }
    //   transaction.update({ status: 'failed', response: JSON.stringify(response.body.data) });
    //   newLoan.update({ status: 'rejected' });
    //   return respondWithWarning(res, 400, 'Could not charge saved card');
    // }

    return respondWithSuccess(res, 200, 'Loan request created successfully', { txref, fee, amount: 10 });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default requestLoan;
