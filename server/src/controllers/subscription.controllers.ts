import { Request, Response } from 'express';
import Subscription from '../models/Subscription';
import User from '../models/User';

export const getUserSubscription = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const subscription = await Subscription.findOne({ userId });
    if (subscription) {
      res.json(subscription);
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const updateUserSubscription = async (req: Request, res: Response) => {
  const { userId, subscriptionLevel } = req.body;
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      { level: subscriptionLevel },
      { new: true }
    );
    if (subscription) {
      res.json({ message: 'Subscription updated successfully', subscription });
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

// Ny funktion för att hämta prenumeration baserat på sessionId
export const getSubscriptionBySessionId = async (req: Request, res: Response) => {
  const { sessionId } = req.query;
  try {
    const subscription = await Subscription.findOne({ stripeId: sessionId });
    if (subscription) {
      res.json(subscription);
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};



// import { Request, Response } from 'express';
// import Subscription, { ISubscription } from '../models/Subscription';
// import { stripe } from './stripe.controllers';

// export const getUserSubscription = async (req: Request, res: Response) => {
//   const userId = req.query.userId as string;
//   console.log(`Fetching subscription for userId: ${userId}`); // Logga för felsökning

//   try {
//     const subscription: ISubscription | null = await Subscription.findOne({ userId });
//     if (!subscription) {
//       console.log(`Subscription not found for userId: ${userId}`); // Logga för felsökning
//       return res.status(404).json({ message: 'Subscription not found' });
//     }
//     console.log(`Subscription level for userId ${userId}: ${subscription.level}`); // Logga för felsökning
//     res.json({ subscriptionLevel: subscription.level });
//   } catch (error) {
//     console.error(`Server error: ${error}`); // Logga för felsökning
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const updateUserSubscription = async (req: Request, res: Response) => {
//   const userId = req.body.userId;
//   const { subscriptionLevel } = req.body;
//   console.log(`Updating subscription for userId: ${userId} to level: ${subscriptionLevel}`); // Logga för felsökning

//   try {
//     const subscription: ISubscription | null = await Subscription.findOne({ userId });
//     if (!subscription) {
//       console.log(`Subscription not found for userId: ${userId}`); // Logga för felsökning
//       return res.status(404).json({ message: 'Subscription not found' });
//     }
//     subscription.level = subscriptionLevel;
//     await subscription.save();
//     console.log(`Subscription updated for userId ${userId} to level: ${subscriptionLevel}`); // Logga för felsökning
//     res.json({ message: 'Subscription updated successfully' });
//   } catch (error) {
//     console.error(`Server error: ${error}`); // Logga för felsökning
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// //url to paste into POSTMAN http://localhost:3000/subscription/create-hardcoded-subscription 
// export const createHardcodedSubscription = async (req: Request, res: Response) => {
//   try {
//     // Skapa en hårdkodad prenumeration
//     const hardcodedSubscription: ISubscription = new Subscription({
//       userId: '123456789', // Använd ett befintligt användar-ID från din databas
//       level: 'Digital', // Välj den prenumerationsnivå du vill testa
//       startDate: new Date(),
//       endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//       nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//       stripeId: 'hardcoded_stripe_id', // Hårdkodat Stripe-prenumerations-ID för teständamål
//     });

//     // Spara den hårdkodade prenumerationen i databasen
//     await hardcodedSubscription.save();

//     res.status(201).json({ message: 'Hardcoded subscription created successfully.' });
//   } catch (error) {
//     console.error('Error creating hardcoded subscription:', error);
//     res.status(500).send('Error creating hardcoded subscription.');
//   }
// };

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
