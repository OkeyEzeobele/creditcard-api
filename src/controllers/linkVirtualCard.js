import db from '../db';
import BevertecApi from '../api/bevertecApi';
import moment from 'moment';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import { encryptCard, padString } from '../helpers/passwordEncryption';
import logger from '../helpers/logger';
import winston from 'winston';

async function linkVirtualCard(req, res) {
  const { id: userId } = req.userData;
  const { cifNumber: cif, pin } = req.body;
  const cifNumber = padString('0', 8, cif);

  try {
    const cifNumber = cif.padStart(8, 0);
    const o3card = await db.O3card.find({ where: { cifNumber } });

    if (o3card) {
      return respondWithWarning(res, 404, 'Card already linked');
    }
    // TODO: Verify Pin
    const isPinVerified = await BevertecApi.verifyPin(cifNumber, pin);
    if (!isPinVerified) {
      return respondWithWarning(res, 404, 'Incorrect pin');
    }
    // const {
    //   cardnum: cardNumber, virtualCard, accounts, cpName,
    // } = await BevertecApi.getCardDetailsFromCif(cifNumber);

    const verifiedCard = await BevertecApi.getCardDetailsFromCif(cifNumber);
    const { cardnum: cardNumber, virtualCard, accounts, cpName, cardExpiryDate } = verifiedCard;

    winston.log(cardNumber, pin, verifiedCard);

    if (cardNumber.substr(-4) !== pin) {
      return respondWithWarning(res, 404, 'Card PIN does not match');
    }


    const acctNum = accounts[0].acctnum;
    const cardBalance = accounts && accounts.find(account => account.acctnum === acctNum).wdavail;

    const O3CardDetails = {
      // cn: cardNumber,
      // ex: moment(cardExpiryDate).format('MM/YY'),
      userId,
      cifNumber,
      virtual: virtualCard === 'Y',
      acctNumber: acctNum,
      first6: cardNumber.substring(0, 6),
      last4: cardNumber.substr(-4),
      cardHash: encryptCard(cardNumber),
      balance: cardBalance,
      type: 'linked',
      orderLabel: cpName,
    };

    const newO3Card = await db.O3card.create(O3CardDetails);

    // TODO: Send Notification

    return respondWithSuccess(res, 201, 'Card Linked Successfully', newO3Card.dataValues);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default linkVirtualCard;
