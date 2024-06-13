import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Subscription, { ISubscription } from '../models/Subscription';
import Level from '../models/Level';
import User, { IUser } from '../models/User';
import Payment, { IPayment } from '../models/Payment';
import { getAllProducts } from './articles.controllers';

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

const createSubscription = async (customerId: string, priceId: string): Promise<any> => {
  try {
    const subscriptionSchedule = await stripe.subscriptionSchedules.create({
      customer: customerId,
      start_date: 'now',
      end_behavior: 'release',
      phases: [{
        items: [{
          price: priceId,
          quantity: 1,
        }],
        iterations: 52,
        billing_thresholds: {
          amount_gte: 10000,
        },
      }],
    });
    return subscriptionSchedule;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

const getSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const productsWithPrices = await getAllProducts();
    console.log('Fetched products with prices:', productsWithPrices);
    res.status(200).json(productsWithPrices);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).send('Error fetching subscriptions.');
  }
};

const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  const { selectedProduct } = req.body;

  if (!req.session || !(req.session as any).user) {
    res.status(401).end();
    return;
  }

  const userId = (req.session as any).user._id;

  console.log("Creating Stripe Checkout Session");
  console.log("Session User:", (req.session as any).user);
  console.log("Selected Product:", selectedProduct);
  console.log("Metadata to be sent:", { userId, subscriptionLevel: selectedProduct.name });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedProduct.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:5173/mypages',
      cancel_url: 'https://www.visit-tochigi.com/plan-your-trip/things-to-do/2035/',
      metadata: {
        userId: userId,
        subscriptionLevel: selectedProduct.name
      },
    });

    console.log("Stripe Checkout Session Created:", session.id);
    console.log("Stripe Checkout Session URL:", session.url);

    const user: IUser | null = await User.findById(userId);
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    console.log("Found user:", user);
    user.stripeId = session.id;
    console.log("Updating user document with stripeId:", user.stripeId);
    try {
      await user.save();
      console.log("User document saved successfully!");
    } catch (err) {
      console.error("Error saving user document:", err);
    }

    const level = await Level.findOne({ name: selectedProduct.name });
    if (!level) {
      res.status(400).json({ error: 'Level not found' });
      return;
    }

    const newSubscription: ISubscription = new Subscription({
      userId: user._id.toString(),
      level: selectedProduct.name,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      stripeId: session.id,
    });
    console.log("Creating new Subscription document:", newSubscription);
    await newSubscription.save();
    console.log("New Subscription document saved:", newSubscription);

    user.subscriptionId = (newSubscription._id as string).toString();
    await user.save();
    console.log("Updated user with new subscriptionId:", user);

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Error creating checkout session.');
  }
};

const verifySession = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.body.sessionId || req.query.sessionId;
    console.log("Received sessionId:", sessionId);

    if (!sessionId) {
      console.log("No sessionId provided");
      res.status(400).send('Session ID is required');
      return;
    }

    console.log("Verifying session with Stripe:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['customer', 'subscription'] });
    console.log("Stripe session retrieved:", session);

    if (session.payment_status === 'paid') {
      console.log("Session payment status is 'paid'");
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      console.log("Line items from session:", lineItems.data);
      
      const userId = session.metadata?.userId;
      const subscriptionLevel = session.metadata?.subscriptionLevel;
      if (!userId || !subscriptionLevel) {
        console.log("User ID or Subscription Level is missing in session metadata");
        res.status(400).send('User ID or Subscription Level is missing in session metadata');
        return;
      }
      let user: IUser | null = await User.findById(userId);
        if (!user) {
          console.log("User not found for session userId:", userId);
          res.status(400).json({ error: 'User not found' });
          return;
        }
      let subscription = await Subscription.findOne({ stripeId: sessionId });

    

      if (!subscription) {
        console.log("No existing subscription found, creating new subscription");
        

        

        if (!session.subscription || typeof session.subscription === 'string' || !('id' in session.subscription)) {
          console.log("Subscription information is missing in session");
          res.status(400).json({ error: 'Subscription information is missing in session' });
          return;
        }

        console.log("Found user:", user);
        subscription = new Subscription({
          userId: user._id.toString(),
          level: subscriptionLevel,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          stripeId: sessionId,
          status: 'active',
          stripeSubId: session.subscription.id,  
        });

        await subscription.save();
        console.log("New Subscription document created:", subscription);

        user.subscriptionId = subscription._id as string;
        await user.save();
        console.log("Updated user with new subscriptionId:", user);
      } else {
        console.log("Existing subscription found:", subscription);
      }

      const existingPayment = await Payment.findOne({ stripeId: sessionId });
      if (!existingPayment) {
        const amount = lineItems.data.reduce((total, item) => total + item.amount_total, 0);
        const payment = new Payment({
          userId: subscription.userId,
          subscriptionId: subscription._id,
          amount,
          transactionDate: new Date(),
          status: 'paid',
          stripeId: sessionId,
        });
        console.log("Creating new Payment document:", payment);
        await payment.save();
        console.log("Payment document created:", payment);
      } else {
        console.log("Payment document already exists for session:", sessionId);
      }
// skicka med user från databasen och skicka med stripe subid

      res.status(200).json({
        user: {
          _id: user.id,
          email: user.email,
        password: user.password,   
        stripeId: user.stripeId,
        stripeSubId: subscription.stripeSubId,
        subscriptionId: user.subscriptionId,
          subscriptionLevel: subscription.level,
          nextBillingDate: subscription.nextBillingDate,
          endDate: subscription.endDate,
          status: subscription.status
        },
        stripeSubId: subscription.stripeSubId,
        verified: true,
        stripeId: sessionId,
        subscriptionLevel: subscription.level,
        subscriptionId: subscription._id 
      });
    } else {
      console.log("Session payment status is not 'paid'");
      res.status(200).json({ verified: false });
    }
  } catch (error) {
    console.error('Error verifying session:', (error as Error).message);
    res.status(500).json({ message: 'Error verifying session', error: (error as Error).message });
  }
};


const updateSubscriptionFromStripeEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, eventData } = req.body;

    if (eventType === 'invoice.payment_succeeded' && eventData && eventData.subscription) {
      const subscriptionId = eventData.subscription as string;

      console.log("Updating subscription from Stripe event:", subscriptionId);
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const nextBillingDate = new Date(subscription.current_period_end * 1000);

      const updatedSubscription = await Subscription.findOneAndUpdate(
        { stripeId: subscriptionId },
        { nextBillingDate },
        { new: true }
      );

      if (updatedSubscription) {
        console.log('Subscription updated successfully:', updatedSubscription);
        res.status(200).send('Subscription updated successfully.');
      } else {
        console.error('Failed to update subscription.');
        res.status(500).send('Failed to update subscription.');
      }
    } else {
      res.status(400).send('Invalid event type or missing subscription data.');
    }
  } catch (error) {
    console.error('Error updating subscription from Stripe event:', error);
    res.status(500).send('Error updating subscription from Stripe event.');
  }
};


//hämta subscription stripe sub_id från databasen
// stripe.subscriptions.retrieve stripe sub_id
//får tillbaka subscription objekt
// latest invoice id = subscription.latest_invoice
// invoice = stripe.invoices.retrieve(latest_invoice)
// får tillbaka invoice objekt
// invoice.hosted_invoice_url     skicka tillbaka till användaren för klick
// }

const getFailedPaymentLink = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body.userId;

  try {
    const subscription = await Subscription.findOne({ userId });

    if (!subscription || !subscription.stripeSubId) {
      res.status(404).json({ error: "Subscription not found" });
      return;
    }
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubId);
    const latestInvoiceId = stripeSubscription.latest_invoice as string;
    const invoice = await stripe.invoices.retrieve(latestInvoiceId);
    const hostedInvoiceUrl = invoice.hosted_invoice_url;
    if (hostedInvoiceUrl) {
      res.status(200).json({ url: hostedInvoiceUrl });
    } else {
      res.status(404).json({ error: "Hosted invoice URL not found" });
    }
  } catch (error) {
    console.error("Error retrieving failed payment link:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export { createCheckoutSession, getSubscriptions, verifySession, createSubscription, updateSubscriptionFromStripeEvent, getFailedPaymentLink  };
