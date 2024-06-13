import express from 'express';
import { createCheckoutSession, getSubscriptions, verifySession, getFailedPaymentLink } from '../controllers/stripe.controllers';

const stripeRouter = express.Router();

stripeRouter.get('/subscriptions', getSubscriptions);
stripeRouter.post('/create-checkout-session', createCheckoutSession);
stripeRouter.post('/verify-session', verifySession);
stripeRouter.post('/failed-payment-link', getFailedPaymentLink);

export default stripeRouter;
