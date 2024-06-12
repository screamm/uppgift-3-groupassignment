import express from 'express';
import { getFailedPaymentLink } from '../controllers/payment.controllers';

const paymentRouter = express.Router();

paymentRouter.get('/failed-payment-link/:subscriptionId', getFailedPaymentLink);

export default paymentRouter;
