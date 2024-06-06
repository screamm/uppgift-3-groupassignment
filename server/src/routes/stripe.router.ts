import express from 'express';
import { createCheckoutSession, getSubscriptions, verifySession } from '../controllers/stripe.controllers';
import { handleStripeWebhook } from '../controllers/webhook.controllers';

const stripeRouter = express.Router();

stripeRouter.get('/subscriptions', getSubscriptions);
stripeRouter.post('/create-checkout-session', createCheckoutSession);
stripeRouter.post('/verify-session', verifySession);
stripeRouter.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default stripeRouter;
