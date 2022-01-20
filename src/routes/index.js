import signup from './signup';
import login from './login';
import securitypin from './securitypin'
import passwordReset from './passwordReset';
import createAdmin from './createAdmin';
import adminLogin from './adminLogin';
import adminPasswordReset from './adminPasswordReset';
import userVerification from './userVerification';
import getBeneficiaries from './getBeneficiaries';
import createBeneficiary from './createBeneficiary';
import personalInfo from './personalInfo';
import manageDocumentInfo from './manageDocumentInfo';
import addressInfo from './addressInfo';
import employerInfo from './employerInfo';
import checkRequiredInfo from './checkRequiredInfo';
import requestLoan from './requestLoan';
import requestCreditCard from './requestCreditCard';
import requestPrepaidCard from './requestPrepaidCard';
import checkAuthStatus from './checkAuthStatus';
import checkAdminAuthStatus from './checkAdminAuthStatus';
import getAddressInfo from './getAddressInfo';
import getDocumentInfo from './getDocumentInfo';
import getPersonalInfo from './getPersonalInfo';
import getEmployerInfo from './getEmployerInfo';
import expireUserInfo from './expireUserInfo';
import blockUser from './blockUser';
// import createBankCard from './createBankCard';
// import updateBankCard from './updateBankCard';
import verifyBankAccountNumber from './verifyBankAccountNumber';
import getBillCategories from './getBillCategories';
import getCountries from './getCountries';
import getBillerNames from './getBillerNames';
import createAccountBeneficiary from './createAccountBeneficiary';
import getAccountBeneficiaries from './getAccountBeneficiaries';
import verifyFlutterwaveCardPayment from './verifyFlutterwaveCardPayment';
import checkTransactionStatus from './checkTransactionStatus';
import adminFetchLoans from './adminFetchLoans';
import getBankCard from './getBankCard';
import getUserCreditScore from './getUserCreditScore';
import requestTransfer from './requestTransfer';
import requestTopup from './requestTopup';
import adminGetLoanDetails from './adminGetLoanDetails';
import getLoan from './getLoan';
import getAllLoans from './getAllLoans';
import adminApproveLoan from './adminApproveLoan';
import adminRejectLoan from './adminRejectLoan';
import adminCompleteLoan from './adminCompleteLoan';
import createO3Card from './createO3Card';
import getTransactions from './getTransactions';
import getExternalTransactions from './getExternalTransactions';
import resolveCifNumber from './resolveCifNumber';
import fetchVirtualCardBalance from './fetchVirtualCardBalance';
import linkVirtualCard from './linkVirtualCard';
import getBanksList from './getBanksList';
import accountTransferStatus from './accountTransferStatus';
import validateBillId from './validateBillId';
import requestBill from './requestBill';
import billStatusCheck from './billStatusCheck';
import verifyBVN from './verifyBVN';
import adminDownload from './adminDownload';
import adminCurrentOpenLoans from './adminCurrentOpenLoans';
import adminSumOpenLoans from './adminSumOpenLoans';
import adminDisburseLoan from './adminDisburseLoan';
import adminFetchCards from './adminFetchCards';
import adminGetCardDetails from './adminGetCardDetails';
import adminExpireProfileSegment from './adminExpireProfileSegment';
import adminFetchBills from './adminFetchBills';
import adminFetchTransactions from './adminFetchTransactions';
import adminGetBillDetails from './adminGetBillDetails';
import adminGetTransactionDetails from './adminGetTransactionDetails';
import adminCountCustomers from './adminCountCustomers';
import adminFetchCustomers from './adminFetchCustomers';
import adminGetCustomerDetails from './adminGetCustomerDetails';
import adminTopBills from './adminTopBills';
import adminTopTransactions from './adminTopTransactions';
import adminFetchAdmins from './adminFetchAdmins';
import unlinkVirtualCard from './adminUnlinkCard';
import deleteUser from './adminDeleteUser';

export default (router) => {
  // AUTH
  signup(router);
  login(router);
  securitypin(router);
  passwordReset(router);
  userVerification(router);
  checkAuthStatus(router);
  // Payment Attempt (Loan Topup)
  getBankCard(router);
  // createBankCard(router);
  // updateBankCard(router);
  verifyFlutterwaveCardPayment(router);
  checkTransactionStatus(router);
  // Loan
  requestLoan(router);
  getUserCreditScore(router);
  getLoan(router);
  getAllLoans(router);
  verifyBVN(router);
  // Transfer
  getBeneficiaries(router);
  createBeneficiary(router);
  verifyBankAccountNumber(router);
  createAccountBeneficiary(router);
  getAccountBeneficiaries(router);
  requestTransfer(router);
  getBanksList(router);
  accountTransferStatus(router);
  // Bills
  getBillCategories(router);
  getCountries(router);
  getBillerNames(router);
  validateBillId(router);
  requestBill(router);
  billStatusCheck(router);
  // Topup
  requestTopup(router);
  // Transaction History
  getTransactions(router);
  getExternalTransactions(router);
  // Profile
  personalInfo(router);
  manageDocumentInfo(router);
  addressInfo(router);
  employerInfo(router);
  checkRequiredInfo(router);
  getAddressInfo(router);
  getDocumentInfo(router);
  getPersonalInfo(router);
  getEmployerInfo(router);
  expireUserInfo(router);
  // Virtual card
  requestCreditCard(router);
  requestPrepaidCard(router);
  createO3Card(router);
  resolveCifNumber(router);
  fetchVirtualCardBalance(router);
  linkVirtualCard(router);
  // Admin
  adminDownload(router);
  createAdmin(router);
  adminLogin(router);
  adminPasswordReset(router);
  checkAdminAuthStatus(router);
  adminFetchLoans(router);
  adminFetchBills(router);
  adminTopBills(router);
  adminTopTransactions(router);
  adminFetchTransactions(router);
  adminFetchCards(router);
  adminFetchCustomers(router);
  adminFetchAdmins(router);
  adminCurrentOpenLoans(router);
  adminSumOpenLoans(router);
  adminGetLoanDetails(router);
  adminGetCustomerDetails(router);
  adminGetBillDetails(router);
  adminGetCardDetails(router);
  adminGetTransactionDetails(router);
  adminApproveLoan(router);
  adminDisburseLoan(router);
  adminRejectLoan(router);
  adminCompleteLoan(router);
  adminCountCustomers(router);
  blockUser(router);
  adminExpireProfileSegment(router);
  unlinkVirtualCard(router);
  deleteUser(router)
};