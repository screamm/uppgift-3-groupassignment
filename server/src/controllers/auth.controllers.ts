import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Stripe from 'stripe';
import { Session, SessionData } from 'express-session';
import { stripe } from './stripe.controllers';

interface CustomRequest extends Request {
  session: Session & Partial<SessionData> & {
    userId?: string;
  };
}

export const registerUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, firstName, lastName, subscriptionId, role } = req.body;
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

    // Kontrollera att selectedProduct och priceId finns
    console.log("Selected product in backend:", req.body.selectedProduct); // Debug: logga den valda produkten

    if (!req.body.selectedProduct || !req.body.selectedProduct.priceId) {
      res.status(400).json({ message: 'Selected product or priceId is missing' });
      return;
    }

    // Create a Stripe checkout session with the selected product's priceId
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.body.selectedProduct.priceId, // Vi använder priceId direkt här
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:5173/mypages',
      cancel_url: 'https://www.visit-tochigi.com/plan-your-trip/things-to-do/2035/',
      metadata: {
        subscriptionLevel: req.body.selectedProduct.name,
      },
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subscriptionId: user.subscriptionId,
      role: user.role,
      sessionId: session.id, // Return the session ID to the client
    });
  } catch (error) {
    next(error);
  }
};



  //skapa en stripecheckout med 
//req.body.selectedProduct 
//1. se till att vi kommer till checkout
//2. lägg in sub i dbtabell efter verify stripe checkout
//3. kolla vilka fält som fortfarande är opopulerade/ejinfoisigännu och var vi kan hitta den infon (lookup)

export const loginUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    req.session.userId = user._id.toString();
    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subscriptionId: user.subscriptionId,
      role: user.role,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
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
