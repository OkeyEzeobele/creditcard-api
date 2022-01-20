import _pick from 'lodash/pick';

import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import { encryptPassword } from '../helpers/passwordEncryption';
import generateJwtToken from '../helpers/generateJwtToken';
import verifyJwtToken from '../helpers/verifyJwtToken';
import sendMailToUser from '../mailers/index';
import permissions from '../permissions/index';
import getRoutePermission from '../helpers/getRoutePermission';
import logger from '../helpers/logger';

async function initiateAdminCreation(req, res) {
  const { role } = req.adminData;
  const routePermission = getRoutePermission(req.url);

  if (!permissions[role].includes(routePermission)) {
    return respondWithWarning(res, 403, 'Forbidden, Only Super Admins are allowed to perform this action');
  }

  const { email, role: adminRole } = req.body;
  try {
    const admin = await db.admin.findOne({
      where: { email },
    });

    if (admin) {
      return respondWithWarning(res, 409, 'Email already in use');
    }

    const payload = { email, adminRole };
    const token = generateJwtToken(payload);

    const mailInfo = {
      to: email,
      subject: 'Invitation to become a Spark NG Admin',
      text: `You have been invited to join Spark NG Admin Group, please click the link below to proceed http://${process.env.CLIENT_SIDE_URL_ADMIN}/adminregistration?token=${token} with your registration`,
      html: `<strong>You have been invited to join Spark NG Admin Group, please click the link below to proceed http://${process.env.CLIENT_SIDE_URL_ADMIN}/adminregistration?token=${token} with your registration</strong>`,
    };

    await sendMailToUser(mailInfo);
    return respondWithSuccess(res, 200, 'Registration Invite has been sent successfully');
  } catch (error) {
    logger.error({
      message: 'Error Occurred creating Admin',
      error,
    });
    return respondWithWarning(res, 500, 'Error Occurred creating Admin');
  }
}

async function createAdmin(req, res) {
  const { token, password } = req.body;
  try {
    const { email, adminRole: role } = verifyJwtToken(token, process.env.JWT_KEY);
    const newAdmin = await db.admin.findOrCreate({
      where: { email },
      defaults: {
        email,
        role,
        password: encryptPassword(password),
      },
    }).spread((admin, created) => {
      if (!created) {
        return null;
      }
      return admin;
    });

    if (!newAdmin) {
      return respondWithWarning(res, 409, 'Email already in use');
    }

    const adminDetails = _pick(newAdmin.toJSON(), ['id', 'role', 'email']);
    const adminToken = generateJwtToken(adminDetails);

    // TODO: Use SendGrid Templates instead of Normal text
    const mailInfo = {
      to: email,
      subject: 'Admin Registration Successful',
      text: 'Congratulations!!! You are now a Spark NG Admin, You can now login using your credentials',
      html: '<strong>Congratulations!!! You are now a Spark NG Admin, You can now login using your credentials</strong>',
    };

    await sendMailToUser(mailInfo);
    return respondWithSuccess(res, 201, 'Admin Registration successful', { admin: { ...adminDetails }, adminToken });
  } catch (error) {
    logger.error({
      message: 'Admin Registration not successful',
      error,
    });
    return respondWithWarning(res, 500, 'Admin Registration not successful');
  }
}

export { initiateAdminCreation, createAdmin };
