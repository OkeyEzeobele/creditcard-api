import dotenv from 'dotenv';
import sendMailToUser from './index';

dotenv.config();

const sendUserVerificationEmail = async (userEmail, fullName, token) => {
  // const mailInfo = {
  //   to: userEmail,
  //   templateId: process.env.VERIFY_EMAIL_TEMPLATE_ID,
  //   dynamic_template_data: {
  //     fullName,
  //     verificationLink: `${process.env.CLIENT_SIDE_URL}/email-verification?token=${token}`,
  //   },
  // };

  // return sendMailToUser(mailInfo);

  return true;
};

export default sendUserVerificationEmail;
