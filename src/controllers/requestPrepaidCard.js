import winston from 'winston';
import db from '../db';
import BevertecApi from '../api/bevertecApi';
import sendMailToUser from '../mailers/index';
import sendOnboardingEmail from '../mailers/sendOnboardingEmail';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import { encryptCard } from '../helpers/passwordEncryption';
import logger from '../helpers/logger';

async function requestPrepaidCard(req, res) {
  // const { id: userId } = req.userData;
  // try {
  //   await db.pcrequest.create({
  //     userId,
  //   });
  //   return respondWithSuccess(res, 200, 'Prepaid card request sent successfully');
  // } catch (e) {
  //   logger.error({
  //     message: 'An Error Occured',
  //     error: e,
  //   });
  //   return respondWithWarning(res, 500, 'An Error Occured');
  // }


  const { id: userId } = req.userData;
  // const { cardType } = req.body;

  try {
    const personalInfo = await db.personalInfo.findOne({ where: { userId } });
    const { phone, email } = await db.user.findByPk(userId);
    const addressInfo = await db.addressInfo.findOne({ where: { userId } });
    // const employerInfo = await db.employerInfo.findOne({ where: { userId } });
    const documents = await db.document.findAll({ where: { userId }, raw: true });
    const maxCards = await db.O3card.count({ where: { userId, type: 'prepaid' } });

    if (documents && !(documents.find(docs => docs.type == 'selfie'))) {
      return respondWithWarning(res, 404, 'Customer Image Selfie not found please upload your picture before applying for a prepaid card');
    }

    if (documents && !(documents.find(docs => docs.type == 'personalIdCard'))) {
      return respondWithWarning(res, 404, 'Customer ID not found please upload a valid ID before applying for a prepaid card');
    }

    if (!personalInfo) {
      return respondWithWarning(res, 404, 'Personal Information not found please fill out your personal Information before applying for a prepaid card');
    }

    if (!addressInfo) {
      return respondWithWarning(res, 404, 'Address Information not found please fill out your address Information before applying for a prepaid card');
    }

    if (maxCards >= 1) {
      return respondWithWarning(res, 404, 'You can have only one prepaid card.');
    }

    // if (!employerInfo) {
    //   return respondWithWarning(res, 404, 'employer Information not found please fill out your
    //   employer Information before applying for a prepaid card');
    // }

    const {
      firstName,
      lastName,
      middleName,
      gender,
      dob,
      maritalStatus,
    } = personalInfo;

    const { homeAddress, homeCity, homeCountry } = addressInfo;

    // const { profession, organizationName, yearsOnJob } = employerInfo;

    const userDetails = {
      userId,
      firstName,
      lastName,
      middleName,
      gender,
      dob,
      maritalStatus,
      homeAddress,
      homeCity,
      homeCountry,
      phone,
      email,
      profession: null,
      organizationName: null,
      yearsOnJob: null,
    };

    const {
      appNumber,
      acctNum: acctNumber,
      cif: cifNumber,
      virtualCard: virtual,
      cardNumber,
      cpName,
      balance,
    } = await BevertecApi.createApplication('prepaid', userDetails);

    const O3CardDetails = {
      userId,
      appNumber,
      cifNumber,
      virtual,
      acctNumber,
      first6: cardNumber.substring(0, 6),
      last4: cardNumber.substr(-4),
      cardHash: encryptCard(cardNumber),
      orderLabel: cpName,
      balance,
      type: 'prepaid',
    };

      
    // if (O3CardDetails){
    //   sendOnboardingEmail(userDetails.email,`${userDetails.firstName} ${userDetails.lastName}`,`${O3CardDetails.first6}******${O3CardDetails.last4}`,`${O3CardDetails.cifNumber}`)
    // }

     
    const mailInfo ={
      to: userDetails.email,
      subject:'Welcome Onboard (O3 Prepaid Card)',
      text:`Dear ${userDetails.firstName},We would like to welcome you to O3 Prepaid Cards and inform you of your Customer Identification File (CIF) Number, ${O3CardDetails.cifNumber} Your card details for Registration on the O3 App is; ${O3CardDetails.first6}******${O3CardDetails.last4}.To derive the full benefits from your card, please ensure that:

      You call our CARE Center on 0700O3CARDS (07006322737) to ACTIVATE your Card.
      You download the O3 App on your Android device or IOS device. This will enable you; Know your balance, Transfer to any Bank, Transfer to another O3 card, View your transactions, and so much more.
      You can fund your card through Quickteller, NIBSS Transfer, NIP, NEFT, RTGS, E-Bills, Cash and Cheque payments across the counter. Always quote your CIF number before your name when making payments.
      Our Account Details are
      
      Bank - GTBank Plc
      Account Name - O3 Capital Nigeria Limited
      Account Number – 0152954632.
      
      Thank you for choosing O3 Card.
      
      For further enquiries and assistance, please call or Whatsapp our direct lines on 08126773904, 07025291068 & 08122829445. You can also send us an email at care@o3cards.com
      
      Regards,
      
      O3 Care Team. care@o3cards.com 0700O3CARDS (07006322737)`,
      html:
          `<p style="font-size:14px; line-height:20px; text-align:left">
              Dear ${userDetails.firstName},
          </p>
          <p style="font-size:14px; line-height:20px; text-align:left">
              We would like to welcome you to O3 Prepaid Cards and inform you of your Customer Identification File (CIF) Number, <strong>${O3CardDetails.cifNumber} </strong>
              <br><br>
              Your card details for Registration on the O3 App is; <strong>${O3CardDetails.first6}******${O3CardDetails.last4}</strong>
          </p>
          <img src="../mailers/images/card-warning.png">
          
          <p style="font-size:14px; line-height:20px; text-align:left">
              To derive the full benefits from your card, please ensure that:
          
          </p>
        
          <ol type = i>
              <li style="font-size:14px; line-height:20px; text-align:left"> You call our CARE Center on 0700O3CARDS (07006322737) to ACTIVATE your Card.
              </li>
              <li style="font-size:14px; line-height:20px; text-align:left"> You download the O3 App on your Android device or IOS device. This will enable you; Know your balance, Transfer to any Bank, Transfer to another O3 card, View your transactions, and so much more.
              </li>
          </ol>
          <p style="font-size:14px; line-height:20px; text-align:left">
              You can fund your card through Quickteller, NIBSS Transfer, NIP, NEFT, RTGS, E-Bills, Cash and Cheque payments across the counter. Always quote your CIF number before your name when making payments.<br>Our Account Details are<br><br> <strong>Bank - GTBank Plc<br> Account Name - O3 Capital Nigeria Limited<br> Account Number – 0152954632.</strong><br><br>Thank you for choosing O3 Card.<br><br>For further enquiries and assistance, please call or Whatsapp our direct lines on <strong>08126773904, 07025291068</strong> & <strong>08122829445</strong>. You can also send us an  email at <a href = "mailto: care@o3cards.com">care@o3cards.com</a><br><br>Regards,<br><br> O3 Care Team. 
          </p>
          <hr>
          <div>
          
              <img align="left"src="../mailers/images/card-warning.png" alt ="O3 Capital"width="200" height ="">
            
              <img src="../mailers/images/facebook_icon.png" width="50" height =""alt ="FaceBook" ><br><img src="../mailers/images/twitter_icon.png" width="50" height =""alt ="Twitter">
              <p style="text-align:left"> <a href = "mailto: care@o3cards.com">care@o3cards.com</a> 0700O3CARDS (07006322737)
            </p>
          </div>`
    };

    if (O3CardDetails){await sendMailToUser(mailInfo)};

             
    
    const newO3Card = await db.O3card.create(O3CardDetails);

    try {
      // await setCardStatus(cif, cardNumber, 4);
    } catch (error) {
      winston.log('Error updating card status', error);
    }

    return respondWithSuccess(res, 201, 'Prepaid Card Created Successfully', newO3Card.dataValues);
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, e.message);
  }
}

export default requestPrepaidCard;
