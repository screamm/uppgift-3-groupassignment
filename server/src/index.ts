import express from 'express';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import subscriptionRouter from './routes/subscription.router';
import stripeRouter from './routes/stripe.router';
import authRouter from './routes/auth.router';
import articleRouter from './routes/articles.router';
import paymentRouter from './routes/payment.router';
import bodyParser from 'body-parser';
import { handleStripeWebhook } from './controllers/webhook.controllers';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grupp5')
  .then(() => console.log(colors.yellow('MongoDB connected')))
  .catch(err => console.log(colors.red(`MongoDB connection error: ${err}`)));

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.use('/subscription', subscriptionRouter);
app.use('/auth', authRouter);
app.use('/stripe', stripeRouter);
app.use('/articles', articleRouter);
app.use('/payment', paymentRouter)

// Use express.raw to handle Stripe webhooks
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.listen(port, () => {
  console.log(colors.rainbow(`Server is running on http://localhost:${port}`));
});
