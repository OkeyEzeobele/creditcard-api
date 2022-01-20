import db from '../db';

// helpers
import logger from '../helpers/logger';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

async function GetAccountBeneficiaries(req, res) {
  const { id } = req.userData;
  try {
    const userDetails = await db.user.find({
      include: [{
        model: db.accountBeneficiary,
        as: 'accountBeneficiaries',
        attributes: ['accountName', 'accountNumber', 'bankCode', 'currency'],
        through: { attributes: [] },
      }],
      where: { id },
    });

    const { accountBeneficiaries } = userDetails;

    return respondWithSuccess(res, 200, 'Account Beneficiaries Fetched Successfully',
      { accountBeneficiaries });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default GetAccountBeneficiaries;
