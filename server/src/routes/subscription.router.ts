import express from 'express';
import { getUserSubscription, updateUserSubscription } from '../controllers/subscription.controllers';
// import { getUserSubscription, updateUserSubscription } from '../controllers/user.controllers';

const subscriptionRouter = express.Router();

subscriptionRouter.get('/', getUserSubscription);

subscriptionRouter.post('/', updateUserSubscription);

export default subscriptionRouter;


//stripe id
