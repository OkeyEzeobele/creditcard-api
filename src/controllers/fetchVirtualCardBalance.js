import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

import BevertecApi from '../api/bevertecApi';

function callBalanceApi(virtualCards) {
  return Promise.all(virtualCards.map(async (card) => {
    const { cifNumber, acctNumber } = card;
    const balance = await BevertecApi.fetchBalance(cifNumber, acctNumber);
    card.update({ balance });
    return card;
  }));
}

async function fetchVirtualCardBalance(req, res) {
  try {
    const { id: userId } = req.userData;

    const virtualCards = await db.O3card.findAll({
      where: { userId },
    });
    if (!virtualCards) {
      return respondWithWarning(res, 404, 'No virtual card created yet');
    }
    const cards = await callBalanceApi(virtualCards);
    return respondWithSuccess(res, 200, 'Balance fetched successfully', cards);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default fetchVirtualCardBalance;
