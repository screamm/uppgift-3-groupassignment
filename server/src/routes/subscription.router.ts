import express from 'express';
import { getUserSubscription, updateUserSubscription, getSubscriptionBySessionId, cancelSubscription, getFailedPaymentLink } from '../controllers/subscription.controllers';

const subscriptionRouter = express.Router();

subscriptionRouter.get('/', getUserSubscription);
subscriptionRouter.get('/session', getSubscriptionBySessionId);
subscriptionRouter.post('/', updateUserSubscription);
subscriptionRouter.post('/cancel', cancelSubscription);
subscriptionRouter.get('/failed-payment-link', getFailedPaymentLink);

export default subscriptionRouter;
