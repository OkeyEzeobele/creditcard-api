// Controller
import { adminFetchTransactions, adminFetchBankTransactions, adminFetchO3Transactions, adminFetchBills } from '../controllers/adminFetchTransactions';

import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-fetch-transactions', isAdmin, adminFetchTransactions);
  router.get('/api/v1/admin-bank-txns', isAdmin, adminFetchBankTransactions);
  router.get('/api/v1/admin-fetch-O3-transactions', isAdmin, adminFetchO3Transactions);
  router.get('/api/v1/admin-fetch-all-Bills', isAdmin, adminFetchBills);
};
