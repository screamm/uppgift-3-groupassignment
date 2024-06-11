import express from 'express';
import { getAllProducts, getSortedArticles } from '../controllers/articles.controllers';
import Article from '../models/Article';

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

articleRouter.post('/articles', async (req, res) => {
  try {
    const { title, description, level } = req.body;
    console.log('FORM DATA: ', title, description, level);

    const newArticle = new Article({
      level: level,
      description: description,
      title: title,
    })
    
    await newArticle.save();
    res.status(201).send(newArticle);

  } catch (error: any) {
    console.error('Error saving article:', error);
    res.status(500).json({ message: 'Failed to save article', error });
  }
});

export default articleRouter;
