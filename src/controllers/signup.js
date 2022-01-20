import _pick from 'lodash/pick';
import moment from 'moment';
import db from '../db';
import sendUserVerificationEmail from '../mailers/sendUserVerificationEmail';
import BevertecApi from '../api/bevertecApi';
import cardHelper from '../api/card';
import sendOnboardingEmail from '../mailers/sendOnboardingEmail';
import Login from './login';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import { encryptPassword } from '../helpers/passwordEncryption';
import generateJwtToken from '../helpers/generateJwtToken';
import logger from '../helpers/logger';

async function Signup(req, res) {
  const pinToken = encryptPassword((Math.random() * 1000000000).toFixed(0));
  const {
    email, password, phone, fullName, pushToken, deviceId, dob,
  } = req.body;

  try {
    if (moment.duration(moment().diff(dob)).asYears() < 20) {
      return respondWithWarning(res, 409, 'Signup is not allowed. Requirements not met.');
    }

    const newUser = await db.user.findOrCreate({
      where: { email } && {phone},
      defaults: {
        email,
        password: encryptPassword(password),
        resetToken: pinToken,
        phone,
        fullName,
        pushToken,
        deviceId,
        dob,
      },
    }).spread((user, created) => {
      if (!created) {
        return null;
      }
      return user;
    });

    if (!newUser) {
      return respondWithWarning(res, 409, 'Email or Phone Number already in use');
    }
    const user = _pick(newUser.toJSON(), ['id', 'email', 'fullName']);
    const userExtras = newUser.toJSON();
    const token = generateJwtToken(user, null, '1d');

    const userPayload = _pick(newUser.toJSON(), ['id', 'fullName']);
    const authtoken = generateJwtToken(userPayload);

    await sendUserVerificationEmail(email, fullName, token);

    const nubanId = user.id.toString().padStart(9, '0')
    const o3Prefix = 940090
    const prefix = o3Prefix.toString()
    const calc = (prefix[0]*3)+(prefix[1]*7)+(prefix[2]*3)+(prefix[3]*3)+(prefix[4]*7)+(prefix[5]*3)+(nubanId[0]*3)+(nubanId[1]*7)+(nubanId[2]*3)+(nubanId[3]*3)+(nubanId[4]*7)+(nubanId[5]*3)+(nubanId[6]*3)+(nubanId[7]*7)+(nubanId[8]*3)
    const checkDigit = (10-(calc%10))
    const nubanCode = "" + nubanId + checkDigit
    // const sortCode = "" + prefix + 15 + checkDigit

    newUser.update({ nuban: `${nubanCode}`})
    // await Login(email, password)

    // create card

    setTimeout(() => {
      cardHelper.createNewUserCard(userExtras);
    }, 1000);


    return respondWithSuccess(res, 201, 'Registration successful, check your mail for a verification link to complete the Registration process',
      {
        ...user, token: authtoken, isVerified: false, pinToken,
      });
  } catch (error) {
    logger.error({
      message: 'Registration not successful',
      error,
    });
    return respondWithWarning(res, 500, 'Registration not successful');
  }
}

export default Signup;
