import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function createAddressInfo(req, res) {
  const { id: userId } = req.userData;
  const userAddressInfo = { ...req.body, userId };
  try {
    const createdAddressInfo = await db.addressInfo.findOrCreate({
      where: { userId },
      defaults: {
        ...userAddressInfo,
      },
    }).spread((address, created) => {
      if (!created) {
        return null;
      }
      return address;
    });

    if (!createdAddressInfo) {
      return respondWithWarning(res, 409, 'Address Information already created');
    }

    return respondWithSuccess(res, 201, 'Address Information Created Successfully', createdAddressInfo.dataValues);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default createAddressInfo;
