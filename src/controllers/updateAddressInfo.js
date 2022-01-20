import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function updateAddressInfo(req, res) {
  const { id: userId } = req.userData;

  try {
    const addressInfo = await db.addressInfo.find({ where: { userId } });

    if (addressInfo) {
      const updatedAddressInfo = await addressInfo.update(req.body,
        { fields: Object.keys(req.body) });

      return respondWithSuccess(res, 200, 'Address Information Updated Successfully', updatedAddressInfo.dataValues);
    }
    return respondWithWarning(res, 404, 'Address Information not added yet');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default updateAddressInfo;
