import { Request, Response } from 'express';
import { IArticle } from '../models/Article';
import Article from '../models/Article';
import { stripe } from './stripe.controllers';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await stripe.products.list();
        console.log('Stripe response:', products.data.map(product => ({ id: product.id, name: product.name })));

        const productsWithPrices = [];
        const errors = [];

        for (const product of products.data) {
            try {
                const price = await stripe.prices.retrieve(product.default_price as string);
                productsWithPrices.push({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    images: product.images,
                    price: price.unit_amount ? price.unit_amount / 100 : null
                });
            } catch (error: any) {
                console.error('Error fetching product price:', error.message);
                errors.push(error.message || 'Error fetching product price');
            }
        }

        if (errors.length > 0) {
            return res.status(500).json({ errors });
        }

        return res.json(productsWithPrices);
    } catch (error: any) {
        console.error('Error fetching products:', error.message);
        return res.status(500).json({ error: 'Error fetching products' });
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
