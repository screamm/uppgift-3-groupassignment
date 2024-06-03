import express from 'express';
import mongoose from 'mongoose';
import subscriptionRouter from './routes/subscription.router';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import stripeRouter from './routes/stripe.router'
import authRouter from './routes/auth.router';
import session from 'express-session';
import articleRouter from './routes/articles.router';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173', // Specificera origin
  credentials: true, // Tillåt credentials
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
app.use('/stripe', stripeRouter)
app.use('/articles', articleRouter);

app.listen(port, () => {
console.log(colors.rainbow(`Server is running on http://localhost:${port}`));
});


// import express from 'express';
// import mongoose from 'mongoose';
// import userRoutes from './routes/subscription.router';
// import colors from 'colors';
// import subscriptionRouter from './routes/subscription.router';
// // import dotenv from 'dotenv';
// // const cookieSession = require("cookie-session");
// // const stripeRouter = require("./resources/stripe/stripe.router");
// // const userRouter = require("./resources/users/users.router");
// // const authRouter = require("./resources/auth/auth.router");
// // const { getProducts } = require("./resources/stripe/stripe.controller");
// const articleRoutes = require('./routes/articles.router');
// // dotenv.config();
// const app = express();
// const port = process.env.PORT || 3000;
// //OM VI BEHÖVER CORS
// // app.use(
// //   cors({
// //     origin: "http://localhost:5173",
// //     credentials: true,
// //   })
// // );
// // Middleware för att parsa JSON
// app.use(express.json());
// // Anslut till MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grupp5', {
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => console.log('MongoDB connection error:', err));
// app.get('/', (req, res) => {
//   res.send('Hello, TypeScript with Express!');
// });
// // app.use(
// //   cookieSession({
// //     secret: "hemligt",
// //     maxAge: 1000 * 60 * 60 * 24 * 7,
// //   })
// // );
// // app.use("/payments", stripeRouter);
// // app.use("/users", userRouter);
// // app.use("/auth", authRouter);
// // app.get("/products", getProducts);
// app.use('/subscription', subscriptionRouter);
// // app.use('/api/articles', articleRoutes)
// app.listen(port, () => {
//   console.log(colors.rainbow(`Server is running on http://localhost:${port}`));
// });
