import unirest from 'unirest';

import db from '../db';
import BevertecApi from '../api/bevertecApi';
import generateO3cardTxRef from '../helpers/generateO3cardTxRef';
import { verifyPassword } from '../helpers/passwordEncryption';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
import moneywave from '../api/moneywave';

async function requestBill(req, res) {
  const { amount, country, customerId, billerName, shortName, pin, cardId } = req.body;
  const { id: userId } = req.userData;

  try {
    const user = await db.user.findOne({ where: { id: userId } });
    if (!user) { return respondWithWarning(res, 401, 'Invalid Authorization token'); }
    if (!verifyPassword(pin, user.spin)) { return respondWithWarning(res, 403, 'Invalid Security PIN'); }
  } catch (error) {
    logger.error({ message: 'SPIN failure', error, });
    return respondWithWarning(res, 500, 'An Error Occured'); 
  }


  try {
    const fee = '0';
    const card = await db.O3card.findOne({
      where: { id: cardId, userId },
    });

    if (!card) {
      return respondWithWarning(res, 404, 'Card not found');
    }

    const billRequest = await db.billpayment.create({
      userId,
      amount,
      recepient: customerId,
      type: billerName,
      cardId,
      status: 'created',
    });
    const txref = generateO3cardTxRef();
    const narration = `${billerName}/${customerId}`;

    const transaction = await db.transaction.create({
      userId,
      amount,
      fee,
      destination: 'bill',
      destId: billRequest.id,
      source: '03Card',
      sourceId: cardId,
      txref: `bill-${txref}`,
      comment: narration,
    });
  

    // Debit 03 Card
    const debitCardResponse = await BevertecApi.debitCard(card.cifNumber, amount, txref, `BILLPAY-${customerId}`);
    if (!(debitCardResponse.body.data.respCode === '00')) {
      console.log(debitCardResponse.body);
      transaction.update({ status: 'failed', response: JSON.stringify(debitCardResponse.body) });
      return respondWithWarning(res, 409, debitCardResponse.body.data.respMsg);
    }
                                                                                                                                                                                                 

    // Deliever bill to recepient
    const isAirtime = (billerName === 'AIRTIME');
    const raveBillPaymentUrl = process.env.RAVE_BILL_PAYMENT_URL;

    const disburseBill = await moneywave.purchaseBill({
      customerId,
      amount,
      billerName,
      shortName,
      country,
      ref: `BILL-${txref}`,
    })
    
    if (disburseBill.body.status === 'success') {
      // if (disburseBill.body.data.data.Status === 'fail') {
      //   return respondWithWarning(res, 409, 'Payment not successful');
      // }
      transaction.update({ status: 'completed', response: JSON.stringify(disburseBill.body) });
      billRequest.update({ status: 'completed' });
      return respondWithSuccess(res, 200, 'Bill payment successful');
    }
    return respondWithWarning(res, 500, 'An Error occured');
  } catch (error) {
    logger.error({
      message: 'An Error occured',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occured');
  }
}

export default requestBill;
