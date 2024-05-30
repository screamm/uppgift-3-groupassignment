import { Request, Response } from 'express';
import Subscription, { ISubscription } from '../models/Subscription';

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
