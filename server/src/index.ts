import express from 'express';
import mongoose from 'mongoose';
import subscriptionRouter from './routes/subscription.router';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import stripeRouter from './routes/stripe.router';
import authRouter from './routes/auth.router';
import session from 'express-session';
import articleRouter from './routes/articles.router';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(colors.rainbow(`Server is running on http://localhost:${port}`));
});
