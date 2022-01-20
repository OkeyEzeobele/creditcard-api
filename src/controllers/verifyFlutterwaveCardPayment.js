import unirest from 'unirest';
import cryptoRandomString from 'crypto-random-string';

// helpers
import logger from '../helpers/logger';
import generateO3cardTxRef from '../helpers/generateO3cardTxRef';
import BevertecApi from '../api/bevertecApi';
import db from '../db';

const metaRedirect = (res, url) => res.status(200).send(`
  <html>
    <head><meta http-equiv="refresh" content="1; url=${url}" /></head>
    <body></body>
  </html>
`);

async function verifyFlutterwaveCardPayment(req, res) {
  const { txRef } = req.body;
  const url = process.env.RAVE_CARD_PAYMENT_VERIFY_LIVE;

  try {
    const response = await unirest.post(url)
      .headers({
        'Content-Type': 'application/json',
      }).send({
        txref: txRef,
        SECKEY: process.env.RAVE_SECKEY_KEY,
      });
    if (response.body.status === 'success') {
      const transaction = await db.transaction.findOne({
        where: { txref: txRef, status: 'pending' },
      });

      if (!transaction) {
        return metaRedirect(res, `${process.env.CLIENT_SIDE_URL}/loan?status=${encodeURIComponent('Transaction not found')}&status=false`);
      }

      transaction.update({ status: 'completed', response: JSON.stringify(response.body.data) });

      if (transaction.destination === 'loan') {
        const loan = await db.loan.findOne({
          where: { id: transaction.destId },
        });

        if (!loan) {
          return metaRedirect(res, `${process.env.CLIENT_SIDE_URL}/loan?message=${encodeURIComponent('Loan request not found')}&status=false`);
        }

        const { userId } = loan;
        const {
          card_tokens: cardTokens,
          last4digits,
          life_time_token: lifeTimeToken,
          type,
          expirymonth: expiryMonth,
          expiryyear: expiryYear,
        } = response.body.data.card;

        const {
          embedtoken: embedToken,
          shortcode: shortCode,
          expiry,
        } = cardTokens[0];

        const bankCardDetails = {
          last4: last4digits,
          lifeTimeToken,
          embedToken,
          type,
          shortCode,
          expiry,
          expiryMonth,
          expiryYear,
          userId,
        };

        await db.bankcard.create(bankCardDetails);

        const txref = (loan.paymentType === 'card') ? generateO3cardTxRef() : `RAV-${cryptoRandomString({ length: 20 })}`;

        await db.transaction.create({
          userId: loan.userId,
          amount: loan.amount,
          fee: 0,
          destination: loan.paymentType,
          destId: '0',
          source: 'loan',
          sourceId: loan.id,
          txref,
        });
        loan.update({ status: 'pending' });
        return metaRedirect(res, `${process.env.CLIENT_SIDE_URL}/loan?message=${encodeURIComponent('Loan pending for review')}&status=true`);
      }

      if (transaction.destination === 'topup') {
        const topup = await db.topup.findOne({
          where: { id: transaction.destId },
        });
        if (!topup) {
          return metaRedirect(res, `${process.env.CLIENT_SIDE_URL}/loan?message=${encodeURIComponent('Topup request not found')}&status=false`);
        }
        const { cifNumber } = await db.O3card.findOne({
          attributes: ['cifNumber'],
          where: { id: topup.cardId },
        });
        const txref = generateO3cardTxRef();
        const newTransaction = await db.transaction.create({
          userId: topup.userId,
          amount: topup.amount,
          fee: 0,
          destination: '03Card',
          destId: cifNumber,
          source: 'topup',
          sourceId: topup.id,
          txref,
        });
        // const creditCardResponse = { type: 'require manual credit' };

        // disable auto credit
        // if (cifNumber == '00010007') {
        const creditCardResponse = await BevertecApi.creditCard(cifNumber, topup.amount, txref);
        if (creditCardResponse.body.data.respCode !== '00') {
          newTransaction.update({ status: 'failed', response: JSON.stringify(creditCardResponse.body.data) });
          return metaRedirect(res, `${process.env.CLIENT_SIDE_URL}/loan?message=${encodeURIComponent('Card topup not successful')}&status=false`);
        }
        // }

        delete creditCardResponse.body.data.pan;
        newTransaction.update({ status: 'completed', response: JSON.stringify(creditCardResponse.body.data) });
        topup.update({ status: 'sent' });
        return metaRedirect(res, `${process.env.CLIENT_SIDE_URL}/loan?message=${encodeURIComponent('Topup sent successfully')}&status=true`);
      }
    }
    return metaRedirect(res, `${process.env.CLIENT_SIDE_URL}/loan?message=${encodeURIComponent('Card payment not successful')}&status=false`);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return metaRedirect(res, `${process.env.CLIENT_SIDE_URL}/loan?message=${encodeURIComponent('An Error Occured')}&status=false`);
  }
}

export default verifyFlutterwaveCardPayment;
