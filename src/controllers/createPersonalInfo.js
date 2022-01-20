import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
import moment from 'moment';

async function createPersonalInfo(req, res) {
  const { id: userId } = req.userData;
  const { gender, maritalStatus, dob } = req.body;
  try {
    const personalInfoDetails = {
      ...req.body,
      userId,
      gender: gender.toUpperCase(),
      maritalStatus: maritalStatus.toUpperCase(),
    };

    if (moment.duration(moment().diff(dob)).asYears() < 20) {
      return respondWithWarning(res, 400, 'Age requirement not met', { age: 'Age requirement not met' });
    }

    const personalInfo = await db.personalInfo.find({ where: { userId } });
    if (personalInfo) {
      return respondWithWarning(res, 400, 'Personal Information already created');
    }
    const createdPersonalInfo = await db.personalInfo.create(personalInfoDetails);

    return respondWithSuccess(res, 201, 'Personal Information Created Successfully', createdPersonalInfo.dataValues);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default createPersonalInfo;
