import express from 'express';
import { getUserSubscription, updateUserSubscription } from '../controllers/subscription.controllers';

const subscriptionRouter = express.Router();

// Hämta användarens prenumerationsnivå
subscriptionRouter.get('/subscription', getUserSubscription);

// Uppdatera användarens prenumerationsnivå
subscriptionRouter.post('/subscription', updateUserSubscription);

export default subscriptionRouter;
