import express from 'express';
import { getAllProducts, getSortedArticles } from '../controllers/articles.controllers';

const articleRouter = express.Router();

// Hämta alla produkter från Stripe
articleRouter.get('/products', async (req, res) => {
  try {
    const products = await getAllProducts(req, res);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products.');
  }
});

// Hämta och sortera artiklar baserat på nivå
articleRouter.get('/articles', async (req, res) => {
  try {
    const sortedArticles = await getSortedArticles(req, res);
    res.json(sortedArticles);
  } catch (error) {
    console.error('Error fetching and sorting articles:', error);
    res.status(500).send('Error fetching and sorting articles.');
  }
});

export default articleRouter;
