import unirest from 'unirest';

import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function getBillCategories(req, res) {
  const { billerCode, itemCode, customerId } = req.body;

  try {
    const raveBillPaymentUrl = process.env.RAVE_BILL_PAYMENT_URL;

    const billCategories = await unirest.post(raveBillPaymentUrl)
      .headers({
        'Content-Type': 'application/json',
      }).send({
        secret_key: process.env.RAVE_SECKEY_KEY,
        service: `bills_validate_${itemCode}${billerCode}${customerId}`,
        service_method: 'get',
        service_version: 'v1',
        service_channel: 'rave',
      });

    if (billCategories.body.status === 'success') {
      if (billCategories.body.data.Status === 'fail') {
        return respondWithWarning(res, 404, billCategories.body.data.Message);
      }
      return respondWithSuccess(res, 200, billCategories.body.data);
    }
    return respondWithWarning(res, 401, 'error');
  } catch (error) {
    logger.error({
      message: 'An Error occured',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occured');
  }
}

export default getBillCategories;
