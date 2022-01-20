import _pick from 'lodash/pick';

import db from '../db';
import verifyJwtToken from '../helpers/verifyJwtToken';
import sendMailToUser from '../mailers';
import sendUserVerificationEmail from '../mailers/sendUserVerificationEmail';
import generateJwtToken from '../helpers/generateJwtToken';
import logger from '../helpers/logger';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';

const verifyUserEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const { email } = verifyJwtToken(token);

    const user = await db.user.findOne({
      where: { email },
    });

    if (!user) {
      return respondWithWarning(res, 404, 'User with mail does not exist');
    }

    if (user.isVerified) {
      return respondWithSuccess(res, 202, 'Email has already been verified');
    }

    const { email: verifiedEmail, fullName } = await user.update({ isVerified: true });
    const mailInfo = {
      to: verifiedEmail,
      templateId: process.env.VERIFY_EMAIL_SUCCESS_TEMPLATE_ID,
      dynamic_template_data: {
        fullName,
      },
    };

    await sendMailToUser(mailInfo);
    return respondWithSuccess(res, 200, 'Email Verification Completed Successfully, Proceed to Login');
  } catch (error) {
    logger.error({
      message: 'Error occurred verifying email',
      error,
    });
    return respondWithWarning(res, 500, 'Error occurred verifying email');
  }
};

const resendActivationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db.user.findOne({
      where: { email },
    });

    if (!user) {
      return respondWithWarning(res, 404, 'User with mail does not exist');
    }

    if (user.isVerified) {
      return respondWithSuccess(res, 202, 'Email has already been verified');
    }

    const userPayload = _pick(user.toJSON(), ['id', 'email']);
    const token = generateJwtToken(userPayload, null, '1d');

    await sendUserVerificationEmail(email, user.fullName, token);

    return respondWithSuccess(res, 200, 'Please check your mail for a verification link to complete the Registration process');
  } catch (error) {
    logger.error({
      message: 'Error occurred sending activation email',
      error,
    });
    return respondWithWarning(res, 500, 'Error occurred sending activation email');
  }
};

export { verifyUserEmail, resendActivationEmail };
