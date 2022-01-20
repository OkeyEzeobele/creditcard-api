/* eslint-disable no-else-return */
import unirest from 'unirest';

import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import { trimNumbers } from '../helpers/passwordEncryption';
import logger from '../helpers/logger';
import db from '../db';
import winston from 'winston';

async function verifyBVN(req, res) {
  let { bvn, phone } = req.body;
  bvn = trimNumbers(bvn);

  let bvnCheck = false;
  let bvnFound = false;
  let bvnError = null;
  const bvnInfo = {
    firstName: null,
    middleName: null,
    lastName: null,
    address: null,
    phoneNumber: null,
    dob: null
  };

  // let userId;
  // const { adminData } = req;
  // if (adminData) {
  //   userId = req.query.id;
  //   if (!userId) {
  //     return respondWithWarning(res, 400, 'Please Enter a UserId');
  //   }
  // } else {
  const userId = req.userData.id;
  // }

  try {
    const user = await db.user.findOne({
      where: { id: userId },
    });

    if (!user) {
      return respondWithWarning(res, 404, 'User not found');
    }

    const storeBvn = await db.store.findOne({ where: { type: 'bvn', data: bvn }, raw: true });

    if (storeBvn && storeBvn.data) {
      const storedbvnData = JSON.parse(storeBvn.value);
      bvnInfo.firstName = storedbvnData.firstName;
      bvnInfo.middleName = storedbvnData.middleName;
      bvnInfo.lastName = storedbvnData.lastName;
      bvnInfo.address = storedbvnData.address;
      bvnInfo.phoneNumber = storedbvnData.phoneNumber;
      bvnInfo.dob = storedbvnData.dob;

      bvnFound = true;
    } else {
      const raveBVNUrl = `${process.env.RAVE_BASE_URL}/kyc/bvns/${bvn}`;
      const bvnVerifyRequest = await unirest.get(raveBVNUrl)
      .headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RAVE_SECKEY_KEY}`,
      });

      if (bvnVerifyRequest.body.status === 'success') {
        bvnInfo.firstName = bvnVerifyRequest.body.data.first_name;
        bvnInfo.middleName = bvnVerifyRequest.body.data.middle_name;
        bvnInfo.lastName = bvnVerifyRequest.body.data.last_name;
        bvnInfo.address = bvnVerifyRequest.body.data.address;
        bvnInfo.phoneNumber = bvnVerifyRequest.body.data.phone_number;
        bvnInfo.dob = bvnVerifyRequest.body.data.date_of_birth;
        bvnCheck = true;
      } else {
        bvnError = bvnVerifyRequest.body;
      }
    }

    if (bvnCheck || bvnFound) {
      if (bvnCheck) {
        await db.store.create({
          type: 'bvn',
          data: bvn,
          value: JSON.stringify(bvnInfo),
        });
      }

      if (phone && bvnInfo.phoneNumber && phone.slice(-10) === bvnInfo.phoneNumber.slice(-10)) {
        await user.update({
          isBvnVerified: true,
          bvnName: `${bvnInfo.firstName} ${bvnInfo.middleName} ${bvnInfo.lastName}`,
          bvnAddress: bvnInfo.address,
          bvnDob: bvnInfo.dob,
          bvn,
        });
        await db.store.destroy({ where: { type: 'bvn', data: bvn }, force: true });
        return respondWithSuccess(res, 200, 'Successful', bvnError);
      }
      // return respondWithWarning(res, 404, 'BVN verification failed', bvnError);
    }


    await user.update({
      isBvnVerified: false,
      // bvnName: (bvnInfo) ? `${bvnInfo.firstName} ${bvnInfo.middleName} ${bvnInfo.lastName}` : null,
      // bvnAddress: (bvnInfo) ? bvnInfo.address : null,
      // bvnDob: (bvnInfo) ? bvnInfo.dob : null,
      bvn,
    });
    return respondWithSuccess(res, 200, 'Successful', bvnError);
    // return respondWithWarning(res, 404, bvnError);
  } catch (error) {
    console.log(error);
    winston.log({
      message: 'An Error occured',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occured');
  }
}

export default verifyBVN;
