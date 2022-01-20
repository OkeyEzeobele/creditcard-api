import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function getAddressInfo(req, res) {
  let userId;
  const { adminData } = req;
  if (adminData) {
    userId = req.query.id;
    if (!userId) {
      return respondWithWarning(res, 400, 'Please Enter a UserId');
    }
  } else {
    userId = req.userData.id;
  }

  try {
    const addressInfo = await db.addressInfo.find({
      where: { userId },
    });

    if (!addressInfo) {
      return respondWithWarning(res, 404, 'Address not added yet');
    }
    return respondWithSuccess(res, 200, 'success', addressInfo.toJSON());
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default getAddressInfo;
