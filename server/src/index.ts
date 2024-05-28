// src/index.ts
import express from 'express';
import colors from 'colors';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(colors.rainbow(`Server is running on http://localhost:${port}`));
});