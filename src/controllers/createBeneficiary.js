import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function CreateBeneficiary(req, res) {
  const { id: userId } = req.userData;
  const { cifNumber, cardHolderName } = req.body;
  try {
    const beneficiary = await db.beneficiary.findOrCreate({
      where: { cifNumber },
      defaults: {
        cifNumber,
        cardHolderName,
      },
    // eslint-disable-next-line no-unused-vars
    }).spread((result, created) => result);

    const { id: beneficiaryId } = beneficiary;
    const existingUserBeneficiary = await db.usersBeneficiaries.find({
      where: {
        beneficiaryId,
        userId,
      },
    });

    if (existingUserBeneficiary) {
      return respondWithWarning(res, 409, 'Beneficiary already created for this user');
    }

    await db.usersBeneficiaries.create({
      beneficiaryId,
      userId,
    });

    return respondWithSuccess(res, 201, 'Beneficiary Created Successfully',
      { beneficiary });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default CreateBeneficiary;
