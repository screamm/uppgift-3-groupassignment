import express from 'express';
import { getUserSubscription, updateUserSubscription, getSubscriptionBySessionId } from '../controllers/subscription.controllers';

const subscriptionRouter = express.Router();

subscriptionRouter.get('/', getUserSubscription);
subscriptionRouter.post('/', updateUserSubscription);

// Lägg till denna rad för att hämta prenumeration baserat på sessionId
subscriptionRouter.get('/session', getSubscriptionBySessionId);

export default subscriptionRouter;
