import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import { encryptPassword, randomString, verifyPassword } from '../helpers/passwordEncryption';
import generateJwtToken from '../helpers/generateJwtToken';
import verifyJwtToken from '../helpers/verifyJwtToken';
import sendMailToUser from '../mailers/index';
import logger from '../helpers/logger';

async function initiatePasswordReset(req, res) {
  const { email, type } = req.body;
  try {
    const user = await db.user.findOne({
      where: { email },
    });

    if (!user) {
      return respondWithWarning(res, 404, 'User with email does not exist');
    }

    const payload = {
      id: user.id,
      email,
    };

    const secretKey = randomString(4, '1');
    const encryptedPassword = encryptPassword(secretKey);

    user.update({ resetToken: encryptedPassword });

    const mailInfo = {
      to: email,
      subject: 'Reset Password',
      text: `You have requested to reset your password, please use the 4 digit pin  - ${secretKey} -  to proceed with password reset`,
      html: `<p>You have requested to reset your password, <br>please use the 4 digit pin - <b>${secretKey}</b> -  to proceed with password reset</p>`,
    };

    if (type == 'pin') {
      mailInfo.text = `Reset Pin`,
      mailInfo.text = `You have requested to reset your pin, please use the 4 digit code - ${secretKey} -  to proceed with pin reset`;
      mailInfo.text = `<p>You have requested to reset your pin, please use the 4 digit code - <b>${secretKey}</b> -  to proceed with pin reset</p>`;
    }

    const mailer = await sendMailToUser(mailInfo);
    return respondWithSuccess(res, 200, `An Email has been sent to your mail, please follow the instructions to proceed with the ${(type == 'pin') ? 'pin' : 'password'} reset`);
  } catch (error) {
    logger.error({
      message: 'An Error occured',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occured');
  }
}


async function resetPassword(req, res) {
  const { password, token, id } = req.body;
  try {
    const user = await db.user.findById(id);
    if (!user) {
      return respondWithWarning(res, 404, 'User with Id not found');
    }
    const { password: userPreviousPassword } = user;
    if (userPreviousPassword === password) {
      return respondWithWarning(res, 400, 'New password cannot be the same as previous password');
    }
    const secretKey = `${userPreviousPassword}-${user.createdAt}`;
    const payload = verifyJwtToken(token, secretKey);
    if (!payload) {
      return respondWithWarning(res, 403, 'Invalid Token');
    }
    const hashedPassword = encryptPassword(password);
    const updatedUser = await db.user.update({
      password: hashedPassword,
    }, {
      where: { id },
    });


    if (!updatedUser) {
      return respondWithWarning(res, 404, 'User with Id not found');
    }

    const mailInfo = {
      to: user.email,
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
    return respondWithWarning(res, 500, 'An Error occured enter a valid Jwt Token');
  }
}


async function mobilePasswordReset(req, res) {
  const { password, pin, email } = req.body;
  try {
    const user = await db.user.findOne({ where: { email } });
    if (!user) {
      return respondWithWarning(res, 404, 'User not found');
    }

    if (pin && !verifyPassword(pin, user.resetToken)) {
      return respondWithWarning(res, 403, 'Invalid Reset PIN');
    }

    const hashedPassword = encryptPassword(password);
    const updatedUser = await user.update({ password: hashedPassword });

    if (!updatedUser) {
      return respondWithWarning(res, 404, 'Password update failed. User not found');
    }

    const mailInfo = {
      to: user.email,
      subject: 'Password Reset Successful',
      text: 'Your Password reset was successful, login to Application with your new password',
      html: '<p>Your Password reset was successful, login to Application with your new password</p>',
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
    return respondWithWarning(res, 500, 'An Error occured enter a valid Reset Pin');
  }
}

export { initiatePasswordReset, resetPassword, mobilePasswordReset };
