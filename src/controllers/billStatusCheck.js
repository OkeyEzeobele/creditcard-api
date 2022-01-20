import unirest from 'unirest';

import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function billStatusCheck(req, res) {
  const { txRef } = req.body;

  try {
    const raveBillPaymentUrl = process.env.RAVE_BILL_PAYMENT_URL;
    const disburseBill = await unirest.post(raveBillPaymentUrl)
      .headers({
        'Content-Type': 'application/json',
      }).send({
        secret_key: process.env.RAVE_SECKEY_KEY,
        service: `fly_requery_${txRef}`, // Prefix "fly_requery_" plus your transaction reference.
        service_method: 'get',
        service_version: 'v1',
        service_channel: 'rave',
      });
    return respondWithSuccess(res, 200, '', disburseBill.body.data);
  } catch (error) {
    logger.error({
      message: 'An Error occured',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occured');
  }
}

export default billStatusCheck;
