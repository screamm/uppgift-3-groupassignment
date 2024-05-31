import { Request, Response } from 'express';
import { IArticle } from '../models/Article';
import Article from '../models/Article';
import { stripe } from './stripe.controllers';
import dotenv from 'dotenv';

dotenv.config();

// http://localhost:3000/articles/products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await stripe.products.list();
        console.log('Stripe response:', products);

        const productsWithPrices = await Promise.all(
            products.data.map(async (product) => {
                try {
                    const price = await stripe.prices.retrieve(product.default_price as string);
                    return {
                        ...product,
                        price: price.unit_amount ? price.unit_amount / 100 : null
                    };
                } catch (error) {
                    console.error(`Error retrieving price for product ${product.id}:`, error);
                    return null;
                }
            })
        );

        res.json(productsWithPrices.filter(product => product !== null));
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
};

// Funktion för att hämta och sortera artiklar baserat på nivå
export const getSortedArticles = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string;  // Anta att userId kommer som en query parameter

        // Hämta alla artiklar från databasen
        const articles: IArticle[] = await Article.find().exec();

        // Sortera artiklarna baserat på nivå
        const sortedArticles = sortArticlesByLevel(articles);

        res.json(sortedArticles);
    } catch (error) {
        console.error('Error fetching and sorting articles:', error);
        res.status(500).send('Error fetching and sorting articles.');
    }
};

// Funktion för att sortera artiklar baserat på level
const sortArticlesByLevel = (articles: IArticle[]) => {
    const levels: { [key: string]: IArticle[] } = {
        basic: [],
        insight: [],
        elite: [],
        default: []
    };

    articles.forEach(article => {
        const subsLevel = determineLevel(article);
        if (levels[subsLevel]) {
            levels[subsLevel].push(article);
        } else {
            levels['default'].push(article);
        }
    });

    return levels;
};

// Funktion för att bestämma level för en artikel
const determineLevel = (article: IArticle) => {
    const level = article.level.toLowerCase();

    if (level === 'basic' || level === 'insight' || level === 'elite') {
        return level;
    } else {
        return 'default';
    }
};
