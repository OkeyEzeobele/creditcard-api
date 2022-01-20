import unirest from 'unirest';
import dotenv from 'dotenv';
import moment from 'moment';
import cryptoRandomString from 'crypto-random-string';
import winston from 'winston';

dotenv.config();
let authToken;

// const API_BASE_URL = 'https://10.1.1.10:8443/o3c-api/rest';
// const API_BASE_URL = 'https://62.173.44.67:8443/o3c-api/rest';
const API_BASE_URL = 'https://ccs.o3cards.com/o3c-api/rest';
// const API_BASE_URL = 'http://62.173.44.67:8080/o3c-api/rest';

// const isProduction = process.env.NODE_ENV === 'production';
const isProduction = false;


const generateCreateApplicationPayload = (cardType, userDetails, amount) => {
  const {
    firstName,
    lastName,
    middleName,
    gender,
    email,
    dob,
    homeAddress,
    maritalStatus,
    phone,
    profession,
    organizationName,
    yearsOnJob,
  } = userDetails;

  const fullname = firstName.split(' ');
  let cardProductCode = 100;
  let cardHolderTypeKey = 'IND';

  if (amount <= 500000) {
    cardProductCode = 100;
  } else if (amount <= 1000000) {
    cardProductCode = 105;
  } else if (amount <= 1500000) {
    cardProductCode = 110;
  } else if (amount > 1500000) {
    cardProductCode = 160;
    cardHolderTypeKey = 'BUS';
  }


  if (cardType === 'prepaid') {
    return {
      reportingBranch: '0001',
      accountBranch: '4009',
      cardProductNum: '205',
      accountProductNum: '205',
      currency: 566,
      cardHolderType: 'IND',
      virtualCard: false,
      preApproved: 'true',
      salesAgency: null,
      salesPerson: null,
      instId: null,
      expressContactInfo: {
        phone1: phone,
        email,
        addressline1A: homeAddress,
      },
      expressPersonalInfo: {
        firstName: firstName || fullname[0],
        lastName: lastName,
        middleName: middleName || fullname[2],
        gender: gender === 'MALE' ? 0 : 1,
        dateOfBirth: dob,
        driverLicenceNumb: null,
        nameOnCard: `${firstName} ${lastName}`,
        grossIncome: 0,
        grossSalary: 0,
        maritalStatus: maritalStatus === 'SINGLE' ? 0 : 1,
        numbDependents: 0,
      },
      applEmploymentInfoDto: {
        profession,
        employmentType: 6,
        employerName: organizationName,
        yearsOnJob,
        position: 0,
      },
      fileDownloadDtos: [],
      external_kyc_detailsDto: {
        ofac_score: 0,
      },
    };
  }
  return {
    reportingBranch: '0001',
    accountBranch: '4009',
    cardProductNum: cardProductCode, // passed by amount 105 (prestige)
    accountProductNum: cardProductCode,
    currency: 566,
    cardHolderType: 'IND',
    virtualCard: false,
    preApproved: 'true',
    salesAgency: null,
    salesPerson: null,
    instId: null,
    expressContactInfo: {
      phone1: phone,
      email,
      addressline1A: homeAddress,
    },
    expressPersonalInfo: {
      firstName,
      lastName,
      middleName,
      gender: gender === 'MALE' ? 0 : 1,
      dateOfBirth: dob,
      driverLicenceNumb: null,
      nameOnCard: `${firstName} ${lastName}`,
      grossIncome: 0,
      grossSalary: 0,
      maritalStatus: maritalStatus === 'SINGLE' ? 0 : 1,
      numbDependents: 0,
    },
    applEmploymentInfoDto: {
      profession,
      employmentType: 6,
      employerName: organizationName,
      yearsOnJob,
      position: 0,
    },
    fileDownloadDtos: [],
    external_kyc_detailsDto: {
      ofac_score: 0,
    },
  };
};

const authenticate = async () => {
  try {
    const authTicketsResponse = await unirest.post(`${API_BASE_URL}/auth/tickets`)
      .headers({
        'Content-Type': 'application/json',
      })
      .strictSSL(isProduction)
      .send({
        userName: process.env.BEVERTECH_API_USERNAME,
        password: process.env.BEVERTECH_API_PASSWORD,
      });
    authToken = authTicketsResponse.headers.authorization;
    return authToken;
  } catch (err) {
    return err;
  }
};

const getCardDetailsFromAppNum = async (appNum) => {
  const authorization = await authenticate();
  const getCardDetailsFromAppNumResponse = await unirest.get(`${API_BASE_URL}/emboss_records?appnum=${appNum}`)
    .strictSSL(isProduction)
    .headers({
      'Content-Type': 'application/json',
      authorization,
    });

  console.log('---- fetch card data using appNum----', getCardDetailsFromAppNumResponse.body, getCardDetailsFromAppNumResponse.body.messages);

  if (getCardDetailsFromAppNumResponse.body && getCardDetailsFromAppNumResponse.body.embossRec) {
    return getCardDetailsFromAppNumResponse.body.embossRec.find(rec => rec.appNum === appNum);
  } else {
    return [];
  }
};

const getCardDetailsFromCif = async (cifNumber) => {
  const authorization = await authenticate();
  let activeCard = {};

  const response = await unirest.get(`${API_BASE_URL}/customers/${cifNumber}/ccs_response/cards`)
    .strictSSL(isProduction)
    .headers({
      'Content-Type': 'application/json',
      authorization,
    });

  if (response && response.body && response.body.list && response.body.list.length > 1) {
    activeCard = response.body.list.find(activecard => activecard.cardStatus === 'ACTIVE');
  } else if (response && response.body) {
    activeCard = response.body.list[0];
  }

  return activeCard;
};


const setCardStatus = async (cardcif, cardNumber, statuscode) => {
  // ORDERED(1),
  // ISSUED(2),
  // PINNED(3),
  // ACTIVE(4),
  // RENEWED(5),
  // REISSUE(6),
  // REPLACE(7),
  // EXPIRED(8),
  // HOT(9),
  // CUSTOMER_RETURNED(10),
  // INACTIVE(11),
  // PENDING_ACTIVATION(12),
  // REDEEMED(13),
  // SUSPECTED_FRAUD(14);
  const resp = { status: 'fail' };
  const authorization = await authenticate();
  const setStatusResponse = await unirest.post(`${API_BASE_URL}/cards/card_status`)
  .strictSSL(isProduction)
  .headers({
    'Content-Type': 'application/json',
    'Authorization': authorization,
  }).send({
    cardnum: cardNumber,
    cardStatus: statuscode
  });

  console.log('setCardStatus -- ', setStatusResponse.statusCode);
  
  if (setStatusResponse && [200, 202].includes(setStatusResponse.statusCode)) {
    resp.status = 'success';
  }

  return resp;
}


const createApplication = async (cardType, data, amount) => {
  const authorization = await authenticate();
  const payload = generateCreateApplicationPayload(cardType, data, amount);
  let updateCardStatus = false;

  console.log('createApplication --', payload);

  const createApplicationResponse = await unirest.post(`${API_BASE_URL}/express_applications/individual_primary_application`)
    .strictSSL(isProduction)
    .headers({
      'Content-Type': 'application/json',
      authorization,
    }).send(payload);
  console.log('--- create -', cardType, JSON.stringify(createApplicationResponse.body));


  const { appNumber } = createApplicationResponse.body.data;
  const { acctNum, cpName, cif } = await getCardDetailsFromAppNum(appNumber);
  const cardDetails = await getCardDetailsFromCif(cif);
  const {
    cardnum: cardNumber, calink, virtualCard,
  } = cardDetails;

  if (cardType === 'prepaid') {
    try {
      updateCardStatus = await setCardStatus(cif, cardNumber, 4);
    } catch (error) {
      // todo
    }
  }

  const cardBalance = calink && calink.find(account => account.acctnum === acctNum).cardBal;

  return {
    appNumber,
    cardNumber,
    acctNum,
    cif,
    balance: cardBalance || '0.0',
    virtualCard: virtualCard === 'Y',
    cpName,
  };
};

const verifyPin = async (cif, pin) => true;

const fetchBalance = async (cifNumber, accountNumber) => {
  const cardDetails = await getCardDetailsFromCif(cifNumber);
  let cardBalance = '0.0';

  if (cardDetails) {
    try {
      const { accounts } = cardDetails;
  	  cardBalance = accounts && accounts.find(account => account.acctnum === accountNumber).wdavail;
    } catch (error) {
      console.log('Missing Param wdavail --', cardDetails, cifNumber, accountNumber);
    }
  }


  return cardBalance || '0.0';
};

const createTransactionPayload = async (cif, amount, txref, transactionType, narration) => {
  try {
    const {
      cardnum: cardNum, cardnum_hash, accounts, calink, expiry: { year, monthValue },
    } = await getCardDetailsFromCif(cif);

    const month = (monthValue > 9) ? monthValue : `0${monthValue}`;
    const expiryDate = `${year}${month}`;
    const acctNum = accounts[0].acctnum;
    const cardType = calink.find(account => account.acctnum === acctNum).accttype;
    const sysTraceAuditNum = cryptoRandomString({ length: 6, type: 'numeric' });
    const txnDate = moment().format('YYYY-MM-DD');
    const txnTime = moment().format('HH:mm:ss');

    return {
      etfFromAccount: acctNum,
      // sourceTypeName: (cardType === 'CREDIT' || cardType === 'DEBIT') ? `${cardType}_CARD` : cardType,
      sourceCurrency: '566',
      sourceAmount: amount,
      acqInstId: '888888',
      termId: '10000001',
      merchantType: '6011',
      merchId: '1',
      merchCountryCode: 'NG',
      merchName: narration || '03Credit',
      merchCity: 'Lagos',
      // pan: cardNum,
      pan: cardnum_hash,
      // pass pan hash here
      cardExpiryDate: expiryDate,
      posCondCode: '59',
      posEntryMode: '012',
      txnTypeName: `ETF_${transactionType}`.toUpperCase(),
      extRef: txref,
      sysTraceAuditNum,
      txnDate,
      txnTime,
      txnTimeZoneId: 'Africa/Lagos',
    };
  } catch (error) {
    console.log(`Error when prepaing ${transactionType} transaction`, error);
  }
};

const createTransaction = async (payload) => {
  const authorization = await authenticate();
  const response = await unirest.post(`${API_BASE_URL}/iso8583/transaction?debug=false&reversal=false`)
    .strictSSL(isProduction)
    .headers({
      'Content-Type': 'application/json',
      authorization,
    }).send(payload);

  if (response && response.body && response.body.data && response.body.data.pan) {
    delete response.body.data.pan;
  }
  return response;
};

const transactionHistory = async (cardNum, startDate, endDate = null) => {
  const authorization = await authenticate();
  const response = await unirest.get(`${API_BASE_URL}/accounts/transactions/accountTransactions?cardnumber=${cardNum}&getTransactionBalance=false&startDate=${startDate}&(endDate) ? endDate=${endDate} : ${startDate}`)
    .strictSSL(isProduction)
    .headers({
      'Content-Type': 'application/json',
      authorization,
    });
  return response;
};

const resolveCIF = async (cif) => {
  const authorization = await authenticate();
  const response = await unirest.get(`${API_BASE_URL}/customers/${cif}/details`)
    .strictSSL(isProduction)
    .headers({
      'Content-Type': 'application/json',
      authorization,
    });
  return response;
};

const creditCard = async (cif, amount, txref) => {
  console.log('- Requesting Credit', cif, amount, txref);
  const payload = await createTransactionPayload(cif, amount, txref, 'credit');
  console.log('credit --', payload);
  // remove pan in log when displayed
  return createTransaction(payload);
};

const debitCard = async (cif, amount, txref, narration) => {
  // throw Object({ msg: 'Service Unavailable', error: 'Service Unavailable' });
  console.log('- Requesting Debit', cif, amount, txref, narration);
  const payload = await createTransactionPayload(cif, amount, txref, 'debit', narration);
  console.log('debit --', payload);
  // remove pan in log when displayed
  return createTransaction(payload);
};

export default {
  authenticate,
  createApplication,
  getCardDetailsFromAppNum,
  getCardDetailsFromCif,
  fetchBalance,
  verifyPin,
  transactionHistory,
  creditCard,
  debitCard,
  setCardStatus,
  resolveCIF,
};
