import unirest from 'unirest';
import _filter from 'lodash/filter';
import _groupBy from 'lodash/groupBy';
import _mapValues from 'lodash/mapValues';

import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';
import moneywave from '../api/moneywave';


async function getBillCategories(req, res) { // mw
  const { billerName, country = 'NG' } = req.query;
  try {
    const billers = await moneywave.getBillerCategory();

    if (billers && billers.body && billers.body.status === 'success') {
      const sortedBills = {};

      billers.body.data.default.forEach((v) => {
        if (v.Name && v.Country === 'NG') {
          sortedBills[v.CategoryName] = sortedBills[v.CategoryName] || [];
          sortedBills[v.CategoryName].push(v);
        }
      });

      return respondWithSuccess(res, 200, 'success', sortedBills);
    }

    return respondWithWarning(res, 401, 'error', billers);
  } catch (error) {
    logger.error({
      message: 'An Error occured',
      error,
    });
    return respondWithWarning(res, 500, error.message);
  }
}

// async function getBillCategories(req, res) { // v3
//   const { billerName, country = 'NG' } = req.query;
//   try {
//     const raveBillPaymentUrl = process.env.RAVE_BILL_PAYMENT_URL;

//     const billCategories = await unirest.get(raveBillPaymentUrl)
//       .headers({
//         Authorization: `Bearer ${process.env.RAVE_SECKEY_KEY}`,
//         'Content-Type': 'application/json',
//       }).send({
//         // secret_key: process.env.RAVE_SECKEY_KEY,

//         // service: 'bills_categories',
//         // service_method: 'get',
//         // service_version: 'v1',
//         // service_channel: 'rave',
//       });


//     if (billCategories.body.status === 'success') {
//       // const filteredBillOptions = _filter(billCategories.body.data.Data,
//       //   (item => item.BillerName === billerName && item.Country === country));
//       // if (filteredBillOptions.length) {
//       //   return respondWithSuccess(res, 200, 'success', filteredBillOptions);
//       // }

//       // const filteredByCountry = _filter(billCategories.body.data.Data, (item => item.Country === country));
//       // const filteredByCategoryName = _groupBy(filteredByCountry, 'CategoryName');
//       // const filteredByBillerName = _mapValues(filteredByCategoryName, (value, key) => {
//       //   if (key === 'Airtime') {
//       //     return value;
//       //   }
//       //   return _groupBy(value, 'BillerName');
//       // });

//       const sortedBills = {};

//       billCategories.body.data.forEach((v) => {
//         if (v.name && v.country === 'NG') {
//           sortedBills[v.name] = sortedBills[v.name] || [];
//           sortedBills[v.name].push(v);
//         }
//       });

//       return respondWithSuccess(res, 200, 'success', sortedBills);
//     }

//     return respondWithWarning(res, 401, 'error', billCategories.body);
//   } catch (error) {
//     logger.error({
//       message: 'An Error occured',
//       error,
//     });
//     return respondWithWarning(res, 500, error.message);
//   }
// }


// async function getBillCategories(req, res) { // v2
//   const { billerName, country = 'NG' } = req.query;
//   try {
//     const raveBillPaymentUrl = process.env.RAVE_BILL_PAYMENT_URL;

//     const billCategories = await unirest.post(raveBillPaymentUrl)
//       .headers({
//         // Authorization: `Bearer ${process.env.RAVE_SECKEY_KEY}`,
//         'Content-Type': 'application/json',
//       }).send({
//         secret_key: process.env.RAVE_SECKEY_KEY,
//         service: 'bills_categories',
//         service_method: 'get',
//         service_version: 'v1',
//         service_channel: 'rave',
//       });


//     if (billCategories.body.status === 'success') {
//       // const filteredBillOptions = _filter(billCategories.body.data.Data,
//       //   (item => item.BillerName === billerName && item.Country === country));
//       // if (filteredBillOptions.length) {
//       //   return respondWithSuccess(res, 200, 'success', filteredBillOptions);
//       // }

//       // const filteredByCountry = _filter(billCategories.body.data.Data, (item => item.Country === country));
//       // const filteredByCategoryName = _groupBy(filteredByCountry, 'CategoryName');
//       // const filteredByBillerName = _mapValues(filteredByCategoryName, (value, key) => {
//       //   if (key === 'Airtime') {
//       //     return value;
//       //   }
//       //   return _groupBy(value, 'BillerName');
//       // });

//       const sortedBills = {};

//       billCategories.body.data.Data.forEach((v) => {
//         if (v.CategoryName && v.Country === 'NG') {
//           sortedBills[v.CategoryName] = sortedBills[v.CategoryName] || [];
//           sortedBills[v.CategoryName].push(v);
//         }
//       });

//       return respondWithSuccess(res, 200, 'success', sortedBills);
//     }

//     return respondWithWarning(res, 401, 'error', billCategories.body);
//   } catch (error) {
//     logger.error({
//       message: 'An Error occured',
//       error,
//     });
//     return respondWithWarning(res, 500, error.message);
//   }
// }

export default getBillCategories;
