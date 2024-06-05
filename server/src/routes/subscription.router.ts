import express from 'express';
import { getUserSubscription, updateUserSubscription } from '../controllers/subscription.controllers';


const subscriptionRouter = express.Router();

// subscriptionRouter.post('create-subscription', createSubscription);

subscriptionRouter.get('/', getUserSubscription);

subscriptionRouter.post('/', updateUserSubscription);

export default subscriptionRouter;


//stripe id
