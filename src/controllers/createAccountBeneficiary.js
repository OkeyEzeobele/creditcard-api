import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function CreateAccountBeneficiary(req, res) {
  const { id: userId } = req.userData;
  const {
    accountNumber, accountName, currency, bankCode,
  } = req.body;
  try {
    const accountBeneficiary = await db.accountBeneficiary.findOrCreate({
      where: { accountNumber },
      defaults: {
        accountNumber,
        accountName,
        currency,
        bankCode,
      },
    // eslint-disable-next-line no-unused-vars
    }).spread((result, created) => result);

    const { id: accountBeneficiaryId } = accountBeneficiary;
    const existingAccountBeneficiary = await db.usersAccountBeneficiaries.findOne({
      where: {
        accountBeneficiaryId,
        userId,
      },
    });

    if (existingAccountBeneficiary) {
      return respondWithWarning(res, 409, 'Account Beneficiary already created for this user');
    }

    await db.usersAccountBeneficiaries.create({
      accountBeneficiaryId,
      userId,
    });

    return respondWithSuccess(res, 201, 'Beneficiary Created Successfully',
      { accountBeneficiary });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default CreateAccountBeneficiary;
