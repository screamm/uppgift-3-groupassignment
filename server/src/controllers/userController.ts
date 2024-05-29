import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Subscription, { ISubscription } from '../models/Subscription';

export const getUserSubscription = async (req: Request, res: Response) => {
  const userId = req.body.userId; // Anpassa efter autentisering
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const subscription: ISubscription | null = await Subscription.findById(user.subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json({ subscriptionLevel: subscription.level });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateUserSubscription = async (req: Request, res: Response) => {
  const userId = req.body.userId; // Anpassa efter autentisering
  const { subscriptionLevel } = req.body;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const subscription: ISubscription | null = await Subscription.findById(user.subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    subscription.level = subscriptionLevel;
    await subscription.save();
    res.json({ message: 'Subscription updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

