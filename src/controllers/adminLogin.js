import _pick from 'lodash/pick';

import db from '../db';
import { verifyPassword } from '../helpers/passwordEncryption';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import generateJwtToken from '../helpers/generateJwtToken';
import logger from '../helpers/logger';

async function AdminLogin(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await db.admin.findOne({
      where: { email },
    });

    if (!admin || !verifyPassword(password, admin.password)) {
      return respondWithWarning(res, 403, 'Incorrect email or password.');
    }

    const adminPayload = _pick(admin.toJSON(), ['id', 'role']);
    const token = generateJwtToken(adminPayload);

    return respondWithSuccess(res, 200, 'Admin Login successful', { admin: { ...adminPayload }, token });
  } catch (error) {
    logger.error({
      message: 'Admin Login not successful',
      error,
    });
    return respondWithWarning(res, 500, 'Admin Login not successful');
  }
}

export default AdminLogin;
