//FABIAN
//stripeintegration
import { Request, Response } from 'express';
import Stripe from 'stripe';
import fs from 'fs/promises'; 
import path from 'path';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: string;
      email: string;
    };
  }
}

declare module 'express' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

const getSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscriptionPriceData = await stripe.prices.list({
      expand: ['data.product'],
      limit: 100,
    });

    const subscriptionsWithPrice = subscriptionPriceData.data.map((priceData) => {
      const subscription = priceData.product;

      if (typeof subscription === 'string') {
        // Subscription is just an ID
        return null; // Or handle this case appropriately
      }

      if (subscription.deleted) {
        // Subscription is deleted
        return null; // Or handle this case appropriately
      }

      return {
        id: subscription.id,
        name: subscription.name,
        price: (priceData.unit_amount ?? 0) / 100,
        images: subscription.images,
      };
    }).filter(subscription => subscription !== null); // Filter out any null values

    res.status(200).json(subscriptionsWithPrice);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).send('Error fetching subscriptions.');
  }
};

const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
    const cart = req.body;
  
    if (!req.session || !req.session.user) {
      res.status(401).end();
      return;
    }

  try {
    const line_items = await Promise.all(
      cart.map(async (item: any) => {
        const subscription = await stripe.products.retrieve(item.subscription);

        if (subscription.deleted) {
          throw new Error('Subscription is deleted');
        }

        const price = await stripe.prices.list({
          product: item.subscription,
          limit: 1,
        });

        return {
          price_data: {
            currency: 'sek',
            product_data: {
              name: subscription.name,
              images: [subscription.images[0]],
            },
            unit_amount: (price.data[0].unit_amount ?? 0),
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: req.session.user.id,
      customer_email: req.session.user.email,
      line_items: line_items,
      allow_promotion_codes: true,
      mode: 'payment',
    });

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

      const ordersFilePath = path.join(__dirname, '..', 'data', 'orders.json');
      const orders = JSON.parse(await fs.readFile(ordersFilePath, 'utf-8'));
      orders.push(order);
      await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 4));

      res.status(200).json({ verified: true });
      return;
    }

    res.status(200).json({ verified: false });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).send('Error verifying session.');
  }
};

export { createCheckoutSession, getSubscriptions, verifySession };
