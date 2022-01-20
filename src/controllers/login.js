import _pick from 'lodash/pick';

import db from '../db';
import { verifyPassword } from '../helpers/passwordEncryption';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import generateJwtToken from '../helpers/generateJwtToken';
import logger from '../helpers/logger';

async function Login(req, res) {
  try {
    const { email, password, pushToken } = req.body;

    const user = await db.user.findOne({
      where: { email },
    });

    if (!user || !verifyPassword(password, user.password)) {
      return respondWithWarning(res, 403, 'Incorrect email or password.');
    }

    // if (!user.isVerified) {
    //   return respondWithWarning(res, 403, 'Email is not verified, check your mail to complete the verification process');
    // }

    if (user.isBlocked) {
      return respondWithWarning(res, 403, 'User is blocked, Please contact Administrator');
    }

    if (pushToken) {
      await user.update({ pushToken });
    }

    const userPayload = _pick(user.toJSON(), ['id', 'fullName']);
    const token = generateJwtToken(userPayload);

    const optionalPayload = Object.assign({},
      pushToken && { pushToken });

    return respondWithSuccess(res, 200, 'Login successful', {
      user: { ...userPayload }, token, isVerified: user.isVerified, isBvnVerified: user.isBvnVerified, ...optionalPayload,
      cf: {
        lct: 'Last 4 digits of Card'
      },
    });
  } catch (error) {
    logger.error({
      message: 'Login not successful',
      error,
    });
    return respondWithWarning(res, 500, 'Login not successful');
  }
}

export default Login;
