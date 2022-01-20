import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function updateEmployerInfo(req, res) {
  const { id: userId } = req.userData;

  try {
    const employerInfo = await db.employerInfo.find({ where: { userId } });

    if (employerInfo) {
      const updatedEmployerInfo = await employerInfo.update(req.body,
        { fields: Object.keys(req.body) });

      return respondWithSuccess(res, 200, 'Employer Information Updated Successfully', updatedEmployerInfo.dataValues);
    }
    return respondWithWarning(res, 404, 'Employer Information not added yet');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default updateEmployerInfo;
