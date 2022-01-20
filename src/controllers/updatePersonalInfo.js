import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function updatePersonalInfo(req, res) {
  const { id: userId } = req.userData;

  try {
    const personalInfo = await db.personalInfo.find({ where: { userId } });

    if (personalInfo) {
      const updatedPersonalInfo = await personalInfo.update(req.body,
        { fields: Object.keys(req.body) });

      return respondWithSuccess(res, 200,
        'Personal Information Updated Successfully', updatedPersonalInfo.dataValues);
    }
    return respondWithWarning(res, 404, 'Personal Information not added yet');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default updatePersonalInfo;
