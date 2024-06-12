
import { Request, Response } from 'express';
import Stripe from 'stripe';
import Subscription from '../models/Subscription';
import dotenv from 'dotenv';
import stripe from 'stripe';

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

    default:
      console.warn(`Unhandled event type ${event.type}`);
      res.json({ received: true });
      break;
  }
};

const handleInvoicePaymentSucceeded = async (event: Stripe.Event, res: Response) => {
  const invoice = event.data.object as Stripe.Invoice;
  if (invoice.subscription) {
    try {
      const subscription = await Subscription.findOne({ stripeId: invoice.subscription });
      if (subscription) {
        subscription.status = 'active';
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
      const subscription = await Subscription.findOne({ stripeId: invoice.subscription });
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





// import { Request, Response } from 'express';
// import Stripe from 'stripe';
// import Subscription from '../models/Subscription';
// import dotenv from 'dotenv';

// dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2024-04-10',
// });

// const handleStripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers['stripe-signature'] as string;
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
//   } catch (err: any) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   switch (event.type) {
//     case 'checkout.session.completed':
//       await handleCheckoutSessionCompleted(event, res);
//       break;

//     case 'invoice.payment_succeeded':
//       await handleInvoicePaymentSucceeded(event, res);
//       break;

//     case 'customer.subscription.updated':
//     case 'customer.subscription.deleted':
//       await handleSubscriptionUpdate(event, res);
//       break;

//     default:
//       console.warn(`Unhandled event type ${event.type}`);
//       res.json({ received: true });
//       break;
//   }
// };

// const handleCheckoutSessionCompleted = async (event: Stripe.Event, res: Response) => {
//   const session = event.data.object as Stripe.Checkout.Session;

//   if (session.payment_status === 'paid') {
//     const userId = session.metadata?.userId;

//     if (!userId) {
//       console.error('User ID is missing in session metadata.');
//       return res.status(400).send('User ID is missing in session metadata.');
//     }

//     try {
//       const subscription = new Subscription({
//         userId: userId,
//         level: session.metadata?.subscriptionLevel,
//         startDate: new Date(),
//         endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//         nextBillingDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Set next billing date to 7 days from now
//         stripeId: session.subscription as string,
//         status: 'active',
//       });

//       await subscription.save();
//       console.log(`Subscription created for user: ${userId}`);
//       res.json({ received: true });
//     } catch (err: any) {
//       console.error('Error saving subscription:', err.message);
//       res.status(500).send(`Error saving subscription: ${err.message}`);
//     }
//   } else {
//     res.json({ received: true });
//   }
// };

// const handleInvoicePaymentSucceeded = async (event: Stripe.Event, res: Response) => {
//   const invoice = event.data.object as Stripe.Invoice;
//   if (invoice.subscription) {
//     try {
//       const subscription = await Subscription.findOne({ stripeId: invoice.subscription });
//       if (subscription) {
//         subscription.status = 'active';
//         subscription.nextBillingDate = new Date(invoice.lines.data[0].period.end * 1000);
//         await subscription.save();
//         console.log('Subscription updated:', subscription);
//         res.json({ received: true });
//       } else {
//         console.error('Subscription not found:', invoice.subscription);
//         res.status(404).send('Subscription not found.');
//       }
//     } catch (err: any) {
//       console.error('Error updating subscription:', err.message);
//       res.status(500).send(`Error updating subscription: ${err.message}`);
//     }
//   }
// };

// const handleSubscriptionUpdate = async (event: Stripe.Event, res: Response) => {
//   const stripeSubscription = event.data.object as Stripe.Subscription;
//   try {
//     const subscription = await Subscription.findOne({ stripeId: stripeSubscription.id });
//     if (subscription) {
//       subscription.status = stripeSubscription.status;
//       subscription.nextBillingDate = new Date(stripeSubscription.current_period_end * 1000);
//       await subscription.save();
//       console.log('Subscription updated:', subscription);
//       res.json({ received: true });
//     } else {
//       console.error('Subscription not found:', stripeSubscription.id);
//       res.status(404).send('Subscription not found.');
//     }
//   } catch (err: any) {
//     console.error('Error updating subscription:', err.message);
//     res.status(500).send(`Error updating subscription: ${err.message}`);
//   }
// };

// export { handleStripeWebhook };
