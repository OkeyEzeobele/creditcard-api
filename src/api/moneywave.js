import unirest from 'unirest';

const moneyRaveAuthUrl = `${process.env.MONEY_RAVE_URL}/v1/merchant/verify`;
const moneyRaveBiller = `${process.env.MONEY_RAVE_URL}/v1/bill/category`;
const moneyRaveAccountResolve = `${process.env.MONEY_RAVE_URL}/v1/resolve/account`;
const moneyRaveBill = `${process.env.MONEY_RAVE_URL}/v1/bill/order`;

const getAuthToken = async () => {
  const { body: { token } } = await unirest.post(moneyRaveAuthUrl)
  .headers({
    'Content-Type': 'application/json',
  }).send({
    apiKey: process.env.MONEY_WAVE_KEY,
    secret: process.env.MONEY_WAVE_SECRET,
  });

  return token;
}


const getBillerCategory = async () => {
  const token = await getAuthToken();
  const billers = await unirest.get(moneyRaveBiller)
  .headers({
    'Content-Type': 'application/json',
    'Authorization': token
  });

  return billers;
}


const resolveAccount = async (accountNumber, bankCode, currency = 'NGN') => {
  const token = await getAuthToken();
  const bankInfo = await unirest.post(moneyRaveAccountResolve)
    .headers({
      Authorization: token,
      'Content-Type': 'application/json',
    }).send({
      account_number: accountNumber,
      bank_code: bankCode,
      currency: currency,
    });

  return bankInfo.body;
}


const disburse = async (data) => {
  const token = await getAuthToken();
  const transferDisburse = await unirest
    .post(`${process.env.MONEY_RAVE_URL}/v1/disburse`)
    .headers({
      Authorization: token
    })
    .send({
      ref: data.ref,
      amount: data.amount,
      currency: data.currency,
      bankcode: data.bankcode,
      accountNumber: data.accountNumber,
      narration: data.narration,
      senderName: process.env.TRANSFER_SENDER_NAME,
      lock: process.env.MONEY_WAVE_LOCK,
      narration: process.env.TRANSFER_NARATION,
    });

  return transferDisburse;
}



const purchaseBill = async (data) => {
  const token = await getAuthToken();
  const orderbill = await unirest
    .post(moneyRaveBill)
    .headers({
      Authorization: token
    })
    .send({
      ref: data.ref,
      balPassword: process.env.MONEY_WAVE_LOCK,
      country: data.country,
      customerId: data.customerId,
      amount: data.amount,
      billerName: data.billerName,
      shortName: data.shortName,
    });

  console.log(orderbill.body);
  return orderbill;
}


export default {
  getAuthToken,
  getBillerCategory,
  resolveAccount,
  disburse,
  purchaseBill,
};