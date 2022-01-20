// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

import BevertecApi from '../api/bevertecApi';

async function resolveCifNumber(req, res) {
  const { cifNumber } = req.params;
  try {
    const cardDetails = await BevertecApi.getCardDetailsFromCif(cifNumber);
    if (!cardDetails) {
      return respondWithWarning(res, 404, 'Card with Provided CIF Number not found');
    }
    const { nameOnCard2: nameOnCard } = cardDetails;
    return respondWithSuccess(res, 200, 'Card details retrieved successfully', { nameOnCard });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default resolveCifNumber;
