import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function getPersonalInfo(req, res) {
  let userId;
  const { adminData } = req;
  if (adminData) {
    userId = req.query.id;
    if (!userId) {
      return respondWithWarning(res, 400, 'Please Enter a userId');
    }
  } else {
    userId = req.userData.id;
  }
  try {
    const personalInfo = await db.personalInfo.find({
      where: { userId },
    });

    if (!personalInfo) {
      return respondWithWarning(res, 404, 'Personal Info not added yet');
    }
    return respondWithSuccess(res, 200, 'success', personalInfo.toJSON());
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default getPersonalInfo;
