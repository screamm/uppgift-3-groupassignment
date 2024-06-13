import { Request, Response } from 'express';
import Stripe from 'stripe';
import Subscription from '../models/Subscription';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event, res);
      break;

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event, res);
      break;

    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event, res);
      break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event, res);
        break;

    default:
      console.warn(`Unhandled event type ${event.type}`);
      res.json({ received: true });
      break;
  }
};

const handleSubscriptionUpdated = async (event: Stripe.Event, res: Response) => {

  const subscription = event.data.object as Stripe.Subscription;
  console.log('###############################################################################');
  console.log('Subscription updated:', subscription);

  const userSubscription = await Subscription.findOne({ stripeSubId: subscription.id });

console.log('*********************************userSubscription:', subscription.items.data);

  if (userSubscription) {
  
    userSubscription.level = subscription.items.data[0].plan.nickname as string;
    await userSubscription.save();
  }



}




const handleCheckoutSessionCompleted = async (event: Stripe.Event, res: Response) => {
  const session = event.data.object as Stripe.Checkout.Session;

  if (session.subscription) {
    try {
      const subscriptionId = session.subscription as string;
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      const userId = session.metadata?.userId;
      const subscriptionLevel = session.metadata?.subscriptionLevel;

      if (!userId || !subscriptionLevel) {
        console.log("User ID or Subscription Level is missing in session metadata");
        res.status(400).send('User ID or Subscription Level is missing in session metadata');
        return;
      }

      const user: IUser | null = await User.findById(userId);
      if (!user) {
        console.log("User not found for session userId:", userId);
        res.status(400).json({ error: 'User not found' });
        return;
      }

      let subscription = await Subscription.findOne({ stripeId: session.id });
      if (!subscription) {
        subscription = new Subscription({
          userId: user._id.toString(),
          level: subscriptionLevel,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          stripeId: session.id,
          status: 'active',
          stripeSubId: stripeSubscription.id,  // Spara stripeSubId här
        });

        await subscription.save();
        console.log("New Subscription document created:", subscription);

        user.subscriptionId = subscription._id as string;
        await user.save();
        console.log("Updated user with new subscriptionId:", user);
      } else {
        console.log("Existing subscription found:", subscription);
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error('Error processing checkout session:', err.message);
      res.status(500).send(`Error processing checkout session: ${err.message}`);
    }
  } else {
    res.status(400).send('No subscription found in session.');
  }
};

const handleInvoicePaymentSucceeded = async (event: Stripe.Event, res: Response) => {
  const invoice = event.data.object as Stripe.Invoice;
  if (invoice.subscription) {
    try {
      const subscription = await Subscription.findOne({ stripeSubId: invoice.subscription });
      if (subscription) {
        subscription.status = 'active';
        subscription.nextBillingDate = new Date(invoice.lines.data[0].period.end * 1000);
        await subscription.save();
        console.log('Subscription set to active due to successful payment:', subscription);
        res.json({ received: true });
      } else {
        console.error('Subscription not found:', invoice.subscription);
        res.status(404).send('Subscription not found.');
      }
    } catch (err: any) {
      console.error('Error updating subscription:', err.message);
      res.status(500).send(`Error updating subscription: ${err.message}`);
    }
  }
};

const handleInvoicePaymentFailed = async (event: Stripe.Event, res: Response) => {
  const invoice = event.data.object as Stripe.Invoice;
  if (invoice.subscription) {
    try {
      const subscription = await Subscription.findOne({ stripeSubId: invoice.subscription });
      if (subscription) {
        subscription.status = 'inactive';
        await subscription.save();
        console.log('Subscription set to inactive due to failed payment:', subscription);
        res.json({ received: true });
      } else {
        console.error('Subscription not found:', invoice.subscription);
        res.status(404).send('Subscription not found.');
      }
    } catch (err: any) {
      console.error('Error updating subscription:', err.message);
      res.status(500).send(`Error updating subscription: ${err.message}`);
    }
  }
};

export { handleStripeWebhook };

