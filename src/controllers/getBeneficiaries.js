import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function GetBeneficiaries(req, res) {
  const { id } = req.userData;
  try {
    const userDetails = await db.user.find({
      include: [{
        model: db.beneficiary,
        as: 'beneficiaries',
        attributes: ['cifNumber', 'cardHolderName'],
        through: { attributes: [] },
      }],
      where: { id },
    });

    const { beneficiaries } = userDetails;

    return respondWithSuccess(res, 200, 'success',
      { beneficiaries });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default GetBeneficiaries;
