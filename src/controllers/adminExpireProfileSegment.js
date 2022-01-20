import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function adminExpireProfileSegment(req, res) {
  try {
    const {
      personal, userId, address, employer, documentTypes,
    } = req.body;
    if (personal) {
      const personalInfo = await db.personalInfo.findOne({
        where: { userId },
      });

      if (personalInfo) {
        await db.revision.create({ userId, type: 'personalInfo', data: JSON.stringify(personalInfo) });
        await personalInfo.destroy({ force: true });
      }
    }
    if (address) {
      const addressInfo = await db.addressInfo.findOne({
        where: { userId },
      });

      if (addressInfo) {
        await db.revision.create({ userId, type: 'addressInfo', data: JSON.stringify(addressInfo) });
        await addressInfo.destroy({ force: true });
      }
    }
    if (employer) {
      const employerInfo = await db.employerInfo.findOne({
        where: { userId },
      });

      if (employerInfo) {
        await db.revision.create({ userId, type: 'employerInfo', data: JSON.stringify(employerInfo) });
        await employerInfo.destroy({ force: true });
      }
    }
    if (documentTypes) {
      // if statement is selected, expire data
      if (documentTypes.statement) {
        const document = await db.document.findOne({
          where: {
            userId,
            type: 'statement',
          },
        });

        if (document) {
          await db.revision.create({ userId, type: 'statement', data: JSON.stringify(document) });
          await document.destroy({ force: true });
        }
      }
      // if licence is selected, expire data
      if (documentTypes.licence) {
        const document = await db.document.findOne({
          where: {
            userId,
            type: 'licence',
          },
        });
        if (document) {
          await db.revision.create({ userId, type: 'licence', data: JSON.stringify(document) });
          await document.destroy({ force: true });
        }
      }
      // if passport is selected, expire data
      if (documentTypes.passport) {
        const document = await db.document.findOne({
          where: {
            userId,
            type: 'passport',
          },
        });

        if (document) {
          await db.revision.create({ userId, type: 'passport', data: JSON.stringify(document) });
          await document.destroy({ force: true });
        }
      }
      // if selfie is selected, expire data
      if (documentTypes.selfie) {
        const document = await db.document.findOne({
          where: {
            userId,
            type: 'selfie',
          },
        });

        if (document) {
          await db.revision.create({ userId, type: 'selfie', data: JSON.stringify(document) });
          await document.destroy({ force: true });
        }
      }

      // if personalIdCard is selected, expire data
      if (documentTypes.personalIdCard) {
        const document = await db.document.findOne({
          where: {
            userId,
            type: 'personalIdCard',
          },
        });

        if (document) {
          await db.revision.create({ userId, type: 'personalIdCard', data: JSON.stringify(document) });
          await document.destroy({ force: true });
        }
      }

      // if jobIdCard is selected, expire data
      if (documentTypes.jobIdCard) {
        const document = await db.document.findOne({
          where: {
            userId,
            type: 'jobIdCard',
          },
        });

        if (document) {
          await db.revision.create({ userId, type: 'jobIdCard', data: JSON.stringify(document) });
          await document.destroy({ force: true });
        }
      }
    }
    return respondWithSuccess(res, 200, 'Segments expired successfully');
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default adminExpireProfileSegment;
