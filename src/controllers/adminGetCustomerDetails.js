import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function adminGetCustomerDetails(req, res) {
  const { customerId: userId } = req.params;

  try {
    const customer = await db.user.findOne({
      attributes: { exclude: ['password'] },
      where: { id: userId },
    });

    if (!customer) {
      return respondWithWarning(res, 404, 'Customer not found');
    }

    const personalInfo = await db.personalInfo.findOne({
      where: { userId },
    });

    const employerInfo = await db.employerInfo.findOne({
      where: { userId },
    });

    const addressInfo = await db.addressInfo.findOne({
      where: { userId },
    });

    const documents = await db.document.findOne({
      where: { userId },
    });

    return respondWithSuccess(res, 200, 'success', {
      customer, personalInfo, employerInfo, addressInfo, documents,
    });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default adminGetCustomerDetails;
