import moment from 'moment';

import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

const { Op } = db.Sequelize;

export async function checkPersonalInfo(req, res, next) {
  const { id: userId } = req.userData;
  const { personal } = req.body;
  try {
    if (personal) {
      const info = await db.personalInfo.find({
        where: {
          userId,
          updatedAt: {
            [Op.gte]: moment().subtract(process.env.INFO_EXPIRY_DATE, 'days').toDate(),
          },
        },
      });

      req.check = {
        ...req.check,
        personal: true,
      };

      if (!info) {
        const personalInfo = await db.personalInfo.findOne({
          where: { userId },
        });

        if (personalInfo) {
          await db.revision.create({ userId, type: 'personalInfo', data: JSON.stringify(personalInfo) });
          await personalInfo.destroy({ force: true });
        }

        req.check.personal = false;
      }
    }
    return next();
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export async function checkAddressInfo(req, res, next) {
  const { id: userId } = req.userData;
  const { address } = req.body;
  try {
    if (address) {
      const info = await db.addressInfo.find({
        where: {
          userId,
          updatedAt: {
            [Op.gte]: moment().subtract(process.env.INFO_EXPIRY_DATE, 'days').toDate(),
          },
        },
      });

      req.check = {
        ...req.check,
        address: true,
      };

      if (!info) {
        const addressInfo = await db.addressInfo.findOne({
          where: { userId },
        });

        if (addressInfo) {
          await db.revision.create({ userId, type: 'addressInfo', data: JSON.stringify(addressInfo) });
          await addressInfo.destroy({ force: true });
        }

        req.check.address = false;
      }
    }
    return next();
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export async function checkEmployerInfo(req, res, next) {
  const { id: userId } = req.userData;
  const { employer } = req.body;
  try {
    if (employer) {
      const info = await db.employerInfo.find({
        where: {
          userId,
          updatedAt: {
            [Op.gte]: moment().subtract(process.env.INFO_EXPIRY_DATE, 'days').toDate(),
          },
        },
      });

      req.check = {
        ...req.check,
        employer: true,
      };

      if (!info) {
        const employerInfo = await db.employerInfo.findOne({
          where: { userId },
        });

        if (employerInfo) {
          await db.revision.create({ userId, type: 'employerInfo', data: JSON.stringify(employerInfo) });
          await employerInfo.destroy({ force: true });
        }

        req.check.employer = false;
      }
    }
    return next();
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export async function checkDocumentInfo(req, res, next) {
  const { id: userId } = req.userData;
  const { documentTypes } = req.body;
  try {
    if (documentTypes) {
      req.check = {
        ...req.check,
        documents: {
          statement: false,
          license: false,
          passport: false,
          selfie: false,
          personalIdCard: false,
          jobIdCard: false,
        },
      };

      // if statement is required, check if still valid
      if (documentTypes.statement) {
        const info = await db.document.find({
          where: {
            userId,
            type: 'statement',
            updatedAt: {
              [Op.gte]: moment().subtract(process.env.INFO_EXPIRY_DATE, 'days').toDate(),
            },
          },
        });

        if (!info) {
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
          
          req.check.documents.statement = false;
        }
      }

      // if licence is required, check if still valid
      if (documentTypes.licence) {
        const info = await db.document.find({
          where: {
            userId,
            type: 'licence',
            updatedAt: {
              [Op.gte]: moment().subtract(process.env.INFO_EXPIRY_DATE, 'days').toDate(),
            },
          },
        });

        if (!info) {
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

          req.check.documents.license = false;
        }
      }

      // if passport is required, check if still valid
      if (documentTypes.passport) {
        const info = await db.document.find({
          where: {
            userId,
            type: 'passport',
            updatedAt: {
              [Op.gte]: moment().subtract(process.env.INFO_EXPIRY_DATE, 'days').toDate(),
            },
          },
        });

        if (!info) {
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

          req.check.documents.passport = false;
        }
      }

      // if selfie is required, check if still valid
      if (documentTypes.selfie) {
        const info = await db.document.find({
          where: {
            userId,
            type: 'selfie',
            updatedAt: {
              [Op.gte]: moment().subtract(process.env.INFO_EXPIRY_DATE, 'days').toDate(),
            },
          },
        });

        if (!info) {
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

          req.check.documents.selfie = false;
        }
      }

      // if personalIdCard is required, check if still valid
      if (documentTypes.personalIdCard) {
        const info = await db.document.find({
          where: {
            userId,
            type: 'personalIdCard',
            updatedAt: {
              [Op.gte]: moment().subtract(process.env.INFO_EXPIRY_DATE, 'days').toDate(),
            },
          },
        });

        if (!info) {
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

          req.check.documents.personalIdCard = false;
        }
      }

      // if jobIdCard is required, check if still valid
      if (documentTypes.jobIdCard) {
        const info = await db.document.find({
          where: {
            userId,
            type: 'jobIdCard',
            updatedAt: {
              [Op.gte]: moment().subtract(process.env.INFO_EXPIRY_DATE, 'days').toDate(),
            },
          },
        });

        if (!info) {
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

          req.check.documents.jobIdCard = false;
        }
      }
    }
    return next();
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export function getExpiredFields(req, res) {
  const { check } = req;

  if (Object.keys(check) <= 0) {
    return respondWithSuccess(res, 200, 'All fields up to date');
  }

  check.creditcard = true;

  if (check.statement == false && (check.personalIdCard == false || check.passport == false)) {
    check.creditcard = false;
  }


  return respondWithSuccess(res, 200, 'Expired fields, re-submit details again', check);
}
