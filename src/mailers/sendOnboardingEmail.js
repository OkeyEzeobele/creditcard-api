import dotenv from 'dotenv';
import sendMailToUser from './index';

dotenv.config();

const sendOnboardingEmail = async (userEmail, fullName, cardNum, cif) => {
 const splitName = fullName.split(' ');
  const mailInfo = {
    to: userEmail,
    templateId: process.env.WELCOME_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      "Name": `${splitName[0]}`,
      "cardNumber":`${cardNum}`,
      "userCif": `${cif}`
    },
  };

  return sendMailToUser(mailInfo);

 
};

export default sendOnboardingEmail;
