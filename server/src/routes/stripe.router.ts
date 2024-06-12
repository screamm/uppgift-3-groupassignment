import express from 'express';
import { createCheckoutSession, getSubscriptions, verifySession } from '../controllers/stripe.controllers';

const stripeRouter = express.Router();

stripeRouter.get('/subscriptions', getSubscriptions);
stripeRouter.post('/create-checkout-session', createCheckoutSession);
stripeRouter.post('/verify-session', verifySession);

export default stripeRouter;
