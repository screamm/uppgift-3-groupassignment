import express from 'express';
import { getUserSubscription, updateUserSubscription, getSubscriptionBySessionId } from '../controllers/subscription.controllers';

const subscriptionRouter = express.Router();

subscriptionRouter.get('/', getUserSubscription);
subscriptionRouter.post('/', updateUserSubscription);
subscriptionRouter.get('/session', getSubscriptionBySessionId);

export default subscriptionRouter;
