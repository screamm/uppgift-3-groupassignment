import express from 'express';
import { createCheckoutSession, getSubscriptions, verifySession, getFailedPaymentLink, upGradeSubscription} from '../controllers/stripe.controllers';

const stripeRouter = express.Router();

stripeRouter.get('/subscriptions', getSubscriptions);
stripeRouter.post('/create-checkout-session', createCheckoutSession);
stripeRouter.post('/verify-session', verifySession);
stripeRouter.post('/failed-payment-link', getFailedPaymentLink);
stripeRouter.post('/customer-portal', upGradeSubscription);

export default stripeRouter;
