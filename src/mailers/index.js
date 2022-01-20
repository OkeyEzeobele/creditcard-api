import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMailtoUser = async (mailInfo) => {
  mailInfo.from = mailInfo.from || 'care@o3cards.com';

  if (mailInfo.to && mailInfo.to.includes('@')) {
    try {
      return await sgMail.send(mailInfo);
    } catch (error) {
      console.error(error);
   
      if (error.response) {
        console.error(error.response.body)
      }
  
      return false;
    }
  } else {
    return false;
  }
};

export default sendMailtoUser;
