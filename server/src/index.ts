
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user';
import colors from 'colors';
// import dotenv from 'dotenv';

// dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

// Använda userRoutes för alla rutter under '/api/user'
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(colors.rainbow(`Server is running on http://localhost:${port}`));
});