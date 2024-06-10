import { Request, Response } from 'express';
import Subscription from '../models/Subscription';
import User from '../models/User';
import { AnyCnameRecord } from 'dns';

export const getUserSubscription = async (req: Request, res: Response) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    res.status(400).json({ error: 'Session ID is required' });
    return;
  }

  try {
    console.log('Fetching user with sessionId:', sessionId);
    const user = await User.findOne({ stripeId: sessionId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    console.log('User found:', user);
    const subscription = await Subscription.findOne({ userId: user._id });

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    console.log('Subscription found:', subscription);
    res.status(200).json({ subscriptionLevel: subscription.level });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUserSubscription = async (req: Request, res: Response) => {
  const { userId, subscriptionLevel } = req.body;
  try {
    console.log('Updating subscription for userId:', userId, 'to level:', subscriptionLevel);
    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      { level: subscriptionLevel },
      { new: true }
    );
    if (subscription) {
      console.log('Subscription updated successfully:', subscription);
      res.json({ message: 'Subscription updated successfully', subscription });
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: error.message });
  }
};

// Ny funktion för att hämta prenumeration baserat på sessionId
//subscriptionid (kommer matcha med webhooks sen)
export const getSubscriptionBySessionId = async (req: Request, res: Response) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    res.status(400).json({ error: 'Session ID is required' });
    return;
  }

  try {
    console.log('Fetching user with sessionId:', sessionId);
    const user = await User.findOne({ stripeId: sessionId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    console.log('User found:', user);
    const subscription = await Subscription.findOne({ userId: user._id });

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    console.log('Subscription found:', subscription);
    res.json({ subscriptionLevel: subscription.level });
  } catch (error) {
    console.error('Error fetching subscription by session ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserSubscriptionBySession = async (req: Request, res: Response): Promise<void> => {
  const sessionId = req.query.sessionId as string;

  if (!sessionId) {
    res.status(400).send('Session ID is required');
    return;
  }

  try {
    console.log('Fetching user with sessionId:', sessionId);
    const user = await User.findOne({ stripeId: sessionId });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    console.log('User found:', user);
    const subscription = await Subscription.findOne({ userId: user._id });
    if (!subscription) {
      res.status(404).send('Subscription not found');
      return;
    }

    console.log('Subscription found:', subscription);
    res.json({ subscriptionLevel: subscription.level });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).send('Error fetching subscription.');
  }
};
