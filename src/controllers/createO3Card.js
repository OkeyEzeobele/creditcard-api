import db from '../db';
import BevertecApi from '../api/bevertecApi';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import { encryptCard } from '../helpers/passwordEncryption';
import logger from '../helpers/logger';

async function createO3Card(req, res) {
  const { id: userId } = req.userData;
  const { cardType, amount } = req.body;

  try {
    const personalInfo = await db.personalInfo.findOne({ where: { userId } });

    if (!personalInfo) {
      return respondWithWarning(res, 404, 'Personal Information not found please fill out your personal Information before applying for a prepaid card');
    }
    const {
      firstName,
      lastName,
      middleName,
      gender,
      dob,
      maritalStatus,
    } = personalInfo;

    const { phone, email } = await db.user.findByPk(userId);
    const addressInfo = await db.addressInfo.findOne({ where: { userId } });

    if (!addressInfo) {
      return respondWithWarning(res, 404, 'Address Information not found please fill out your address Information before applying for a prepaid card');
    }

    const { homeAddress, homeCity, homeCountry } = addressInfo;

    const employerInfo = await db.employerInfo.findOne({ where: { userId } });
    const maxCards = await db.O3card.count({ where: { userId, type: 'credit' } });

    if (!employerInfo) {
      return respondWithWarning(res, 404, 'employer Information not found please fill out your employer Information before applying for a prepaid card');
    }

    if (maxCards >= 1) {
      return respondWithWarning(res, 404, 'You can have only one credit card.');
    }

    const { profession, organizationName, yearsOnJob } = employerInfo;

    const userDetails = {
      userId,
      firstName,
      lastName,
      middleName,
      gender,
      dob,
      maritalStatus,
      homeAddress,
      homeCity,
      homeCountry,
      phone,
      email,
      profession,
      organizationName,
      yearsOnJob,
    };

    // const {
    //   appNumber,
    //   acctNum: acctNumber,
    //   cif: cifNumber,
    //   virtualCard: virtual,
    //   cardNumber,
    //   cpName,
    //   balance,
    // } = await BevertecApi.createApplication(cardType, userDetails, amount);

    // const O3CardDetails = {
    //   userId,
    //   appNumber,
    //   cifNumber,
    //   virtual,
    //   acctNumber,
    //   first6: cardNumber.substring(0, 6),
    //   last4: cardNumber.substr(-4),
    //   cardHash: encryptCard(cardNumber),
    //   orderLabel: cpName,
    //   balance,
    // };

    // const newO3Card = await db.O3card.create(O3CardDetails);
    // return respondWithSuccess(res, 201, 'O3Card Information Created Successfully', newO3Card.dataValues);

    await db.ccrequest.create({
      userId,
      amount,
    });
    return respondWithSuccess(res, 200, 'Credit card request sent successfully');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, e.message);
  }
}

export default createO3Card;
