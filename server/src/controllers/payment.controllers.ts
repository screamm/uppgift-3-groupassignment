import { Request, Response } from 'express';
import Stripe from 'stripe';
import Subscription from '../models/Subscription';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

const getFailedPaymentLink = async (req: Request, res: Response) => {
  const subscriptionId = req.params.subscriptionId;

  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).send('Subscription not found');
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeId);

    const lastInvoiceId = stripeSubscription.latest_invoice as string;
    if (!lastInvoiceId) {
      return res.status(404).send('No last invoice found for this subscription');
    }

    const invoice = await stripe.invoices.retrieve(lastInvoiceId);

    const paymentLink = invoice.hosted_invoice_url;
    if (!paymentLink) {
      return res.status(404).send('No payment link found for this invoice');
    }

    res.json({ paymentLink });
  } catch (error) {
    console.error('Error retrieving payment link:', error);
    res.status(500).send('Internal Server Error');
  }
};

export { getFailedPaymentLink };
