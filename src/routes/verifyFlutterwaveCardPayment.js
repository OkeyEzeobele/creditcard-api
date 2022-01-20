// Controllers
import verifyFlutterwaveCardPayment from '../controllers/verifyFlutterwaveCardPayment';

export default (router) => {
  router.post('/api/v1/verify-flutterwave-card-payment', verifyFlutterwaveCardPayment);
};
