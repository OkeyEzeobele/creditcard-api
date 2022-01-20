import unirest from 'unirest';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function verifyBankAccountNumber(req, res) {
  const { accountNumber, bankCode, currency } = req.body;
  const moneyRaveStagingUrl = process.env.MONEY_RAVE_URL;
  const moneyRaveAuthUrl = `${moneyRaveStagingUrl}/v1/merchant/verify`;

  try {
    const { body: { token } } = await unirest.post(moneyRaveAuthUrl)
      .headers({
        'Content-Type': 'application/json',
      }).send({
        apiKey: process.env.MONEY_WAVE_KEY,
        secret: process.env.MONEY_WAVE_SECRET,
      });

    const bankInfo = await unirest
      .post(`${moneyRaveStagingUrl}/v1/resolve/account`)
      .headers({
        Authorization: token,
        'Content-Type': 'application/json',
      }).send({
        account_number: accountNumber,
        bank_code: bankCode,
        currency,
      });

    const { body: { status, data } } = bankInfo;
    if (status === 'success') {
      return respondWithSuccess(res, 200, 'success', { accountName: data.account_name });
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

export default verifyBankAccountNumber;
