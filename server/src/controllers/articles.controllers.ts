import { Request, Response } from 'express';
import { IArticle } from '../models/Article';
import Article from '../models/Article';
import { stripe } from './stripe.controllers';

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

        return res.json(productsWithPrices.filter(product => product !== null));
    } catch (error) {
        console.error('Error fetching products:', error);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error fetching products' });
        }
    }
};

export const getSortedArticles = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string;

        const articles: IArticle[] = await Article.find().exec();

        const sortedArticles = sortArticlesByLevel(articles);

        return res.json(sortedArticles);
    } catch (error) {
        console.error('Error fetching and sorting articles:', error);
        if (!res.headersSent) {
            return res.status(500).send('Error fetching and sorting articles.');
        }
    }
};

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

const determineLevel = (article: IArticle) => {
    const level = article.level.toLowerCase();

    if (level === 'basic' || level === 'insight' || level === 'elite') {
        return level;
    } else {
        return 'default';
    }
};
