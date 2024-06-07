import express from 'express';
import { getUserSubscription, updateUserSubscription, createHardcodedSubscription } from '../controllers/subscription.controllers'; // Importera createHardcodedSubscription från dina controllers

const subscriptionRouter = express.Router();

subscriptionRouter.get('/', getUserSubscription);
subscriptionRouter.post('/', updateUserSubscription);
subscriptionRouter.post('/create-hardcoded-subscription', createHardcodedSubscription); // Lägg till en POST-rutt för createHardcodedSubscription

export default subscriptionRouter;
