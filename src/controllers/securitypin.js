import _pick from 'lodash/pick';

import db from '../db';
import { verifyPassword } from '../helpers/passwordEncryption';
import { encryptPassword } from '../helpers/passwordEncryption';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function SetupPin(req, res) {
  try {
    const { token, spin } = req.body;

    const user = await db.user.findOne({ where: { resetToken: token } });

    if (!(user && user.id)) {
      return respondWithWarning(res, 403, 'Incorrect credentials.');
    }

    await user.update({ spin: encryptPassword(spin), resetToken: null });

    return respondWithSuccess(res, 200, 'Setup successful', {});
  } catch (error) {
    logger.error({
      message: 'Setup not successful',
      error,
    });
    return respondWithWarning(res, 500, 'Setup not successful');
  }
}


async function UpdatePin(req, res) {
  try {
    const { id } = req.userData;
    const { token, spin } = req.body;

    const user = await db.user.findOne({ where: { id } });

    if (user.spin && !(verifyPassword(token, user.spin) || verifyPassword(token, user.resetToken))) {
      return respondWithWarning(res, 403, 'Incorrect credentials.');
    }
    
    await user.update({ spin: encryptPassword(spin), resetToken: null });

    return respondWithSuccess(res, 200, 'Update successful', {});
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'Update not successful');
  }
}


export { SetupPin, UpdatePin };
