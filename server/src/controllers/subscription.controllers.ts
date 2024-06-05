import { Request, Response } from 'express';
import Subscription, { ISubscription } from '../models/Subscription';
import { stripe } from './stripe.controllers';

export const getUserSubscription = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  console.log(`Fetching subscription for userId: ${userId}`); // Logga för felsökning

  try {
    const subscription: ISubscription | null = await Subscription.findOne({ userId });
    if (!subscription) {
      console.log(`Subscription not found for userId: ${userId}`); // Logga för felsökning
      return res.status(404).json({ message: 'Subscription not found' });
    }
    console.log(`Subscription level for userId ${userId}: ${subscription.level}`); // Logga för felsökning
    res.json({ subscriptionLevel: subscription.level });
  } catch (error) {
    console.error(`Server error: ${error}`); // Logga för felsökning
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateUserSubscription = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { subscriptionLevel } = req.body;
  console.log(`Updating subscription for userId: ${userId} to level: ${subscriptionLevel}`); // Logga för felsökning

  try {
    const subscription: ISubscription | null = await Subscription.findOne({ userId });
    if (!subscription) {
      console.log(`Subscription not found for userId: ${userId}`); // Logga för felsökning
      return res.status(404).json({ message: 'Subscription not found' });
    }
    subscription.level = subscriptionLevel;
    await subscription.save();
    console.log(`Subscription updated for userId ${userId} to level: ${subscriptionLevel}`); // Logga för felsökning
    res.json({ message: 'Subscription updated successfully' });
  } catch (error) {
    console.error(`Server error: ${error}`); // Logga för felsökning
    res.status(500).json({ message: 'Server error', error });
  }
};

// export const createSubscription = async (req: Request, res: Response) => {
//   try {
//     const { email, paymentMethod } = req.body;

//     const customer = await stripe.customers.create({
//       email,
//     });

//     const subscription = await createSubscription(customer.id, 'price_123456789'); // Replace with your price ID

//     res.status(201).json({ subscription });
//   } catch (error) {
//     console.error('Error creating subscription:', error);
//     res.status(500).send('Error creating subscription.');
//   }
// };
