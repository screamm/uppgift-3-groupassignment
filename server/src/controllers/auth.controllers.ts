import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Subscription from '../models/Subscription';
import { Session, SessionData } from 'express-session';
import { stripe } from './stripe.controllers';

interface CustomRequest extends Request {
  session: Session & Partial<SessionData> & {
    userId?: string;
  };
}

export const registerUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, firstName, lastName, subscriptionId, role, selectedProduct } = req.body;

  if (!selectedProduct || !selectedProduct.priceId) {
    res.status(400).json({ message: 'Selected product or priceId is missing' });
    return;
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = new User({
    email,
    password,
    firstName,
    lastName,
    subscriptionId,
    role,
  });

  try {
    await user.save();
    req.session.userId = user._id.toString();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedProduct.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:5173/confirmation/{CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://www.visit-tochigi.com/plan-your-trip/things-to-do/2035/',
      metadata: {
        userId: user._id.toString(),
        subscriptionLevel: selectedProduct.name,
      },
    });

    console.log("Stripe Checkout Session Created:", session.id);
    user.stripeId = session.id;
    await user.save();
    
    const userSub = await Subscription.findOne({ stripeId: user.stripeId });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subscriptionId: user.subscriptionId,
      role: user.role,
      stripeId: user.stripeId,
      sessionId: session.id,
      url: session.url,
      stripeSubId: userSub ? userSub.stripeSubId : null
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    next(error);
  }
};

export const loginUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log('User found:', user);

      const subscription = await Subscription.findOne({ userId: user._id });
      if (!subscription) {
        res.status(404).json({ error: 'Subscription not found' });
        return;
      }

      console.log('Subscription found:', subscription);

      req.session.userId = user._id.toString();
      res.json({
        _id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        subscriptionId: user.subscriptionId,
        role: user.role,
        stripeId: user.stripeId,
        sessionId: req.session.id,
        stripeSubId: subscription.stripeSubId,
        subscriptionLevel: subscription.level,
        nextBillingDate: subscription.nextBillingDate,
        endDate: subscription.endDate
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logoutUser = (req: CustomRequest, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Failed to log out' });
    } else {
      res.status(200).json({ message: 'User logged out' });
    }
  });
};

export const getSubscriptionBySessionId = async (req: Request, res: Response): Promise<void> => {
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
    res.json({
      subscriptionLevel: subscription.level,
      nextBillingDate: subscription.nextBillingDate,
      endDate: subscription.endDate
    });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    res.status(500).send('Error fetching subscription.');
  }
};
