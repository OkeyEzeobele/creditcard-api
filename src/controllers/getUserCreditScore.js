import unirest from 'unirest';
import { parseString } from 'xml2js';
import _get from 'lodash/get';

import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function getUserCreditScore(req, res) {
  try {
    const { userId, loanId } = req.query;

    const personalInfo = await db.personalInfo.findOne({
      where: { userId },
    });

    if (!personalInfo || !personalInfo.bvn) {
      return respondWithWarning(res, 404, 'BVN not found, kindly request user to add to their personal info');
    }

    const creditscore = await db.creditscore.findOne({
      where: { userId, loanId },
    });

    if (creditscore) {
      return respondWithSuccess(res, 200, 'Already created', JSON.parse(creditscore.data));
    }

    const { bvn } = personalInfo;

    const response = await unirest
      .post(process.env.CRC_URL)
      .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }).send({
        strUserID: process.env.CRC_USER_ID,
        strPassword: process.env.CRC_PASSWORD,
        strRequest: `
        <REQUEST REQUEST_ID="1">
          <REQUEST_PARAMETERS>
            <REPORT_PARAMETERS RESPONSE_TYPE="1" SUBJECT_TYPE="1" REPORT_ID="104"/>
            <INQUIRY_REASON CODE="1"/>
            <APPLICATION CURRENCY="NGN" AMOUNT="0" NUMBER="0" PRODUCT="017"/>
          </REQUEST_PARAMETERS>
          <SEARCH_PARAMETERS SEARCH-TYPE="4">
            <BVN_NO>${bvn}</BVN_NO>
          </SEARCH_PARAMETERS>
        </REQUEST>`,
      });

    const xml = response.body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    let datapacket;

    parseString(xml, (err, data) => {
      if (err) return null;
      datapacket = data.string.DATAPACKET;
      return null;
    });

    const error = _get(datapacket, '[0]BODY[0]["ERROR-LIST"]');
    const noHit = _get(datapacket, '[0]BODY[0]["NO-HIT"]');

    const SEARCH_CRITERIA = _get(datapacket, '[0]HEADER[0]["SEARCH-CRITERIA"]');
    const CONSUMER_PROFILE = _get(datapacket, '[0]BODY[0].CONSUMER_PROFILE[0]');
    const CREDIT_SCORE_DETAILS = _get(datapacket, '[0]BODY[0].CREDIT_SCORE_DETAILS[0]');
    const BASIC_CREDIT_SUMMARY = _get(datapacket, '[0]BODY[0].BASIC_CREDIT_SUMMARY[0]');
    const SEARCH_RESULT_LIST = _get(datapacket, '[0]BODY[0]["SEARCH-RESULT-LIST"][0]');

    if (error) {
      return respondWithWarning(res, 404, 'Error occurred fetching CRC Record, provide a valid BVN', noHit);
    }

    if (noHit) {
      await db.creditscore.create({
        userId,
        data: JSON.stringify(noHit),
        loanId,
      });
      return respondWithWarning(res, 404, 'CRC Record not found', noHit);
    }


    if (SEARCH_RESULT_LIST) {
      await db.creditscore.create({
        userId,
        data: JSON.stringify(SEARCH_RESULT_LIST),
        loanId,
      });
      return respondWithSuccess(res, 200, 'success', SEARCH_RESULT_LIST);
    }

    const data = {
      SEARCH_CRITERIA,
      CONSUMER_PROFILE,
      CREDIT_SCORE_DETAILS,
      BASIC_CREDIT_SUMMARY,
    };

    await db.creditscore.create({
      userId,
      data: JSON.stringify(data),
      loanId,
    });

    return respondWithSuccess(res, 200, 'success', data);
  } catch (error) {
    logger.error({
      message: 'An Error occurred',
      error,
    });
    return respondWithWarning(res, 500, 'An Error occurred');
  }
}

export default getUserCreditScore;
