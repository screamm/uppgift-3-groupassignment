import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Subscription from '../models/Subscription';
import User from '../models/User';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;

  try {
    const payload = JSON.stringify(req.body, null, 2);
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error('User ID is missing in session metadata.');
          return res.status(400).send('User ID is missing in session metadata.');
        }

        try {
          const subscription = new Subscription({
            userId: userId,
            level: session.metadata?.subscriptionLevel,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          });

          await subscription.save();

          await User.findByIdAndUpdate(userId, { subscriptionId: subscription._id });

          res.json({ received: true });
        } catch (err) {
          console.error('Error saving subscription:', err);
          res.status(500).send('Error saving subscription.');
        }
      } else {
        res.json({ received: true });
      }
      break;
    default:
      console.warn(`Unhandled event type ${event.type}`);
      res.json({ received: true });
      break;
  }
};

export { handleStripeWebhook };
