import unirest from 'unirest';
// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function accountTransferStatus(req, res) {
  const { txRef } = req.body;
  try {
    const moneyRaveStagingUrl = process.env.MONEY_RAVE_URL;
    const moneyRaveAuthUrl = `${moneyRaveStagingUrl}/v1/merchant/verify`;

    const { body: { token } } = await unirest.post(moneyRaveAuthUrl)
      .headers({
        'Content-Type': 'application/json',
      }).send({
        apiKey: process.env.MONEY_WAVE_KEY,
        secret: process.env.MONEY_WAVE_SECRET,
      });

    const transferStatus = await unirest
      .post(`${moneyRaveStagingUrl}/v1/disburse/status`)
      .headers({
        Authorization: token,
        'Content-Type': 'application/json',
      }).send({
        ref: txRef,
      });
    const { body: { status, data } } = transferStatus;
    if (status === 'success' && data.status === 'completed') {
      return respondWithSuccess(res, 200, 'Transfer Successful');
    }
    return respondWithWarning(res, 401, 'error');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default accountTransferStatus;
