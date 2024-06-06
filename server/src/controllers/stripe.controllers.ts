import { Request, Response } from 'express';
import Stripe from 'stripe';
import fs from 'fs/promises';
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';
import Subscription, { ISubscription } from '../models/Subscription';
import { getAllProducts } from './articles.controllers';

dotenv.config();

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY); // Kontrollera att nyckeln laddas

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

// Skapa en prenumerationsplan i Stripe
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

  console.log("Creating Stripe Checkout Session");
  console.log("Session User:", (req.session as any).user);
  console.log("Selected Product:", selectedProduct);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedProduct.priceId, // Använd priceId
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:5173/mypages',
      cancel_url: 'https://www.visit-tochigi.com/plan-your-trip/things-to-do/2035/',
      metadata: {
        subscriptionLevel: selectedProduct.name,
      },
    });

    console.log("Stripe Checkout Session Created:", session.id);
    console.log("Stripe Checkout Session URL: " + session.url);

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Error creating checkout session.');
  }
};

const verifySession = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.body.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      const order = {
        orderNumber: Math.floor(Math.random() * 100000000),
        customerName: session.customer_details?.name,
        subscriptions: lineItems.data,
        total: session.amount_total,
        date: new Date(),
      };

      // Spara Stripe-abonnemangs-ID i variabeln stripeId
      let stripeId = null;
      if (lineItems.data.length > 0) {
        stripeId = lineItems.data[0];
      }

      const ordersFilePath = path.join(__dirname, '..', 'data', 'orders.json');
      const orders = JSON.parse(await fs.readFile(ordersFilePath, 'utf-8'));
      orders.push(order);
      await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 4));

      if (session.metadata) {
        const newSubscription = new Subscription({
          userId: (req.session as any).userId,
          level: session.metadata.subscriptionLevel,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          stripeId: stripeId, // Spara Stripe-abonnemangs-ID
        });

        await newSubscription.save();

        res.status(200).json({ verified: true });
      } else {
        res.status(400).json({ message: 'Metadata is missing in the session' });
      }
      return;
    }

    res.status(200).json({ verified: false });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).send('Error verifying session.');
  }
};


export { createCheckoutSession, getSubscriptions, verifySession, stripe, createSubscription };
