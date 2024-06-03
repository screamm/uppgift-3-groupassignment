import express from 'express';
import { getAllProducts, getSortedArticles } from '../controllers/articles.controllers';

const articleRouter = express.Router();

// Hämta alla produkter från Stripe
articleRouter.get('/products', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    if (!res.headersSent) {
      res.status(500).send(error.message || 'Error fetching products.');
    }
  }
});

// Hämta och sortera artiklar baserat på nivå
articleRouter.get('/articles', async (req, res) => {
  try {
    const sortedArticles = await getSortedArticles();
    res.json(sortedArticles);
  } catch (error: any) {
    console.error('Error fetching and sorting articles:', error);
    if (!res.headersSent) {
      res.status(500).send(error.message || 'Error fetching and sorting articles.');
    }
  }
});

export default articleRouter;
