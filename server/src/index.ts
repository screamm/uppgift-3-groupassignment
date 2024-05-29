
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/subscription';
import colors from 'colors';

// import dotenv from 'dotenv';

// const cookieSession = require("cookie-session");

// const stripeRouter = require("./resources/stripe/stripe.router");
// const userRouter = require("./resources/users/users.router");
// const authRouter = require("./resources/auth/auth.router");
// const { getProducts } = require("./resources/stripe/stripe.controller");



// dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//OM VI BEHÖVER CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// Middleware för att parsa JSON
app.use(express.json());

// Anslut till MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grupp5', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});



// app.use(
//   cookieSession({
//     secret: "hemligt",
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//   })
// );
// app.use("/payments", stripeRouter);
// app.use("/users", userRouter);
// app.use("/auth", authRouter);
// app.get("/products", getProducts);



// Använda userRoutes för alla rutter under '/api/user'
app.use('/api/user', userRoutes);



app.listen(port, () => {
  console.log(colors.rainbow(`Server is running on http://localhost:${port}`));
});