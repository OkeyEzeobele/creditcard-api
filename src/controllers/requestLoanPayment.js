import cryptoRandomString from 'crypto-random-string';

import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function requestTopup(req, res) {
  try {
    const { id: userId } = req.userData;
    const {
      amount,
      cardId,
    } = req.body;

    // const card = await db.O3card.findOne({
    //   where: { id: cardId, userId },
    // });

    // if (!card) {
    //   return respondWithWarning(res, 404, 'Card not found');
    // }

    const txref = `RAV-${cryptoRandomString({ length: 20 })}`;
    const fee = '0';

    // const newTopup = await db.topup.create({
    //   userId,
    //   amount,
    //   status: 'created',
    //   cardId,
    // });

    await db.transaction.create({
      userId,
      amount,
      fee,
      destination: 'loancharge',
      destId: '0', // newTopup.id,
      source: 'bankcard',
      sourceId: '0',
      txref,
    });

    return respondWithSuccess(res, 200, 'Loan charge request created successfully', { txref, fee, amount });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default requestTopup;
