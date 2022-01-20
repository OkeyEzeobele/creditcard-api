import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import { encryptPassword } from '../helpers/passwordEncryption';
import generateJwtToken from '../helpers/generateJwtToken';
import verifyJwtToken from '../helpers/verifyJwtToken';
import sendMailToUser from '../mailers/index';
import logger from '../helpers/logger';


async function initiateAdminPasswordReset(req, res) {
  const { email } = req.body;
  try {
    const admin = await db.admin.findOne({
      where: { email },
    });

    if (!admin) {
      return respondWithWarning(res, 404, 'Admin account does not exist');
    }

    const payload = {
      id: admin.id,
    };

    const secretKey = `${admin.password}-${admin.createdAt}`;
    const token = generateJwtToken(payload, secretKey);

    const mailInfo = {
      to: email,
      subject: 'Reset Password',
      text: `You have requested to reset your password, please click the link below to proceed http://${process.env.CLIENT_SIDE_URL_ADMIN}/resetpassword?id=${payload.id}&token=${token} with password reset`,
      html: `<strong>You have requested to reset your password, please click the link below to proceed http://${process.env.CLIENT_SIDE_URL_ADMIN}/resetpassword?id=${payload.id}&token=${token} with password reset</strong>`,
    };

    await sendMailToUser(mailInfo);
    return respondWithSuccess(res, 200, 'An Email has been sent to your mail, please follow the instructions to proceed with the password reset');
  } catch (error) {
    logger.error({
      message: 'Error occured with password reset',
      error,
    });
    return respondWithWarning(res, 500, 'Error occured with password reset');
  }
}

async function resetAdminPassword(req, res) {
  const { password, token, id } = req.body;
  try {
    const admin = await db.admin.findById(id);
    if (!admin) {
      return respondWithWarning(res, 404, 'Admin with Id not found');
    }
    const { password: adminPreviousPassword } = admin;
    if (adminPreviousPassword === password) {
      return respondWithWarning(res, 400, 'New password cannot be the same as previous password');
    }
    const secretKey = `${adminPreviousPassword}-${admin.createdAt}`;
    const payload = verifyJwtToken(token, secretKey);
    if (!payload) {
      return respondWithWarning(res, 403, 'Invalid Token');
    }
    const hashedPassword = encryptPassword(password);
    const updatedAdmin = await db.admin.update({
      password: hashedPassword,
    }, {
      where: { id },
    });

    if (!updatedAdmin) {
      return respondWithWarning(res, 404, 'Admin account does not exist');
    }

    const mailInfo = {
      to: admin.email,
      subject: 'Password Reset Successful',
      text: 'Your Password reset was successful, login to Application with your new password',
      html: '<strong>Your Password reset was successful, login to Application with your new password</strong>',
    };

    await sendMailToUser(mailInfo);
    return respondWithSuccess(res, 200, 'Password has been reset successfully');
  } catch (error) {
    logger.error({
      message: 'An Error occured',
      error,
    });

    if (error && error.name === 'TokenExpiredError') {
      return respondWithWarning(res, 500, 'Password reset link has expired, request for new link');
    }

    if (error && error.name === 'JsonWebTokenError') {
      return respondWithWarning(res, 500, 'Password reset link is invalid, request for new link');
    }
    return respondWithWarning(res, 500, 'An Error occured');
  }
}

export { initiateAdminPasswordReset, resetAdminPassword };
