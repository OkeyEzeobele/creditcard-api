import cryptoRandomString from 'crypto-random-string';
import unirest from 'unirest';

import db from '../db';
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import BevertecApi from './bevertecApi';

const moneyRaveAuthUrl = `${process.env.MONEY_RAVE_URL}/v1/merchant/verify`;
const moneyRaveAccountResolve = `${process.env.MONEY_RAVE_URL}/v1/resolve/account`;


const kickstartPaymentPlan = async (loan) => {
  // Kick start repayment
  const txref = `RAV-${cryptoRandomString({ length: 20 })}`;
  const amount = 100;
  const newTransaction = await db.transaction.create({
    userId: loan.userId,
    amount,
    fee: 0,
    destination: '0',
    destId: '0',
    source: 'loan',
    sourceId: loan.id,
    txref,
  });
  const url = process.env.RAVE_CHARGE_WITH_TOKEN;
  const { email } = await db.user.find({
    attributes: ['email'],
    where: { id: loan.userId },
  });
  const personalInfo = await db.personalInfo.find({ where: { userId: loan.userId } });
  const {
    firstName,
    lastName,
  } = personalInfo;
  const card = await db.bankcard.findOne({
    where: { userId: loan.userId },
  });
  const response = await unirest.post(url)
    .headers({
      'Content-Type': 'application/json',
    }).send({
      txRef: txref,
      SECKEY: process.env.RAVE_SECKEY_KEY,
      token: card.embedToken,
      currency: 'NGN',
      country: 'NG',
      amount,
      email,
      firstname: firstName,
      lastname: lastName,
      payment_plan: loan.repaymentId,
    });
  if (response.body.status === 'success') {
    newTransaction.update({ status: 'completed', response: JSON.stringify(response.body.data) });
    return true;
  }
  return false;
};

const createRepayment = async (loan) => {
  const createPaymentPlanUrl = process.env.RAVE_CREATE_PAYMENT_PLAN;
  const rate = process.env.LOAN_INTEREST_RATE;
  const interest = (loan.amount * parseInt(rate, 10) * (loan.tenure / 12)) / 100;
  const totalRepaymentAmount = (parseFloat(loan.amount) + parseFloat(interest)).toFixed(2);
  const monthlyRepaymentAmount = (parseFloat(totalRepaymentAmount) / loan.tenure).toFixed(2);
  const paymentPlan = await unirest.post(createPaymentPlanUrl)
    .headers({
      'Content-Type': 'application/json',
    }).send({
      seckey: process.env.RAVE_SECKEY_KEY,
      amount: monthlyRepaymentAmount,
      name: process.env.LOAN_NARATION,
      interval: 'hourly',
      duration: loan.tenure,
    });
  if (paymentPlan.body.status === 'success') {
    const { id: repaymentId, amount: repayment, plan_token: planToken } = paymentPlan.body.data;
    await loan.update({
      repaymentId,
      repaymentAmount: repayment,
      planToken,
    });
    return true;
  }
  return false;
};

const disburseLoanToBank = async ({ amount, bankCode, accountNumber }, token, { txref }) => {
  const loanDisburse = await unirest
    .post(`${process.env.MONEY_RAVE_URL}/v1/disburse`)
    .headers({ Authorization: token })
    .send({
      ref: txref,
      amount,
      currency: 'NGN',
      bankcode: bankCode,
      accountNumber,
      senderName: process.env.LOAN_SENDER_NAME,
      lock: process.env.MONEY_WAVE_LOCK,
      narration: process.env.LOAN_NARATION,
    });
  return loanDisburse;
};

const disburseLoanToCard = async (loan, transaction) => {
  const { cifNumber } = await db.O3card.findOne({
    where: { id: loan.cardNumber },
  });

  const loanDisburse = BevertecApi.creditCard(cifNumber, loan.amount, transaction.txref);
  return loanDisburse;
};

const disburseLoanToUser = async (res, loan, transaction) => {
  let response = false;
  let disburseResponseData;
  if (loan.paymentType === 'bank' && loan.bankCode && loan.accountNumber) {
    const { body: { token } } = await unirest.post(moneyRaveAuthUrl)
      .headers({
        'Content-Type': 'application/json',
      }).send({
        apiKey: process.env.MONEY_WAVE_KEY,
        secret: process.env.MONEY_WAVE_SECRET,
      });

    const bankInfo = await unirest
      .post(moneyRaveAccountResolve)
      .headers({
        Authorization: token,
        'Content-Type': 'application/json',
      }).send({
        account_number: loan.accountNumber,
        bank_code: loan.bankCode,
        currency: 'NGN',
      });

    const { body: { status } } = bankInfo;

    if (status !== 'success') {
      return respondWithWarning(res, 404, 'Invalid bank details');
    }
    const loanDisburse = await disburseLoanToBank(loan, token, transaction);
    response = loanDisburse.body.status === 'success';
    disburseResponseData = loanDisburse.body.data;
  } else if (loan.paymentType === 'card' && loan.cardNumber) {
    const loanDisburse = await disburseLoanToCard(loan, transaction);
    response = loanDisburse.body.data.respCode === '00';
    disburseResponseData = loanDisburse.body.data;
  } else {
    return respondWithWarning(res, 400, 'No payment option provided');
  }

  if (response) {
    transaction.update({ status: 'completed', response: JSON.stringify(disburseResponseData) });
    loan.update({ disbursed: true });
    if (!await createRepayment(loan)) {
      return respondWithWarning(res, 400, 'Loan disbursed successful, but error creating repayment plan');
    }
    if (!await kickstartPaymentPlan(loan)) {
      return respondWithWarning(res, 400, 'Loan disbursed successfully, but could not charge initial payment plan');
    }
    return respondWithSuccess(res, 200, 'Loan disbursed successfully');
  }

  return respondWithWarning(res, 400, 'Loan disbursal not successful, try again');
};

export default disburseLoanToUser;
