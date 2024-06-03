import { Request, Response } from 'express';
import { IArticle } from '../models/Article';
import Article from '../models/Article';
import { stripe } from './stripe.controllers';

export const getAllProducts = async (): Promise<any[]> => {
    try {
        const products = await stripe.products.list();
        console.log('Stripe response:', products.data.map(product => ({ id: product.id, name: product.name })));

        const productsWithPrices = [];

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
                throw new Error(error.message || 'Error fetching product price');
            }
        }

        return productsWithPrices;
    } catch (error: any) {
        console.error('Error fetching products:', error.message);
        throw new Error('Error fetching products');
    }
};

export const getSortedArticles = async (): Promise<any> => {
    try {
        const articles: IArticle[] = await Article.find().exec();
        const sortedArticles = sortArticlesByLevel(articles);
        return sortedArticles;
    } catch (error) {
        console.error('Error fetching and sorting articles:', error);
        throw new Error('Error fetching and sorting articles');
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
