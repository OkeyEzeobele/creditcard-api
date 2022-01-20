import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function createEmployerInfo(req, res) {
  const { id: userId } = req.userData;
  const employerInfoDetails = { ...req.body, userId };

  try {
    const employerInfo = await db.employerInfo.find({ where: { userId } });
    if (employerInfo) {
      return respondWithWarning(res, 409, 'Employer Information already created');
    }
    const createdEmployerInfo = await db.employerInfo.create(employerInfoDetails);

    return respondWithSuccess(res, 201, 'Employer Information Created Successfully', createdEmployerInfo.dataValues);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default createEmployerInfo;
