// article.controller.js
import { Request, Response } from 'express';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function getAllPages() {
  const pages = await stripe.products.list({ type: 'good' });
  return pages.data;
}

// Delar upp artiklar utifrån level
function sortPagesByLevel(pages: any[]) {
  const levels: { [key: string]: any[] } = {};
  pages.forEach(page => {
    const subsLevel = determineLevel(page);
    if (!levels[subsLevel]) {
      levels[subsLevel] = [];
    }
    levels[subsLevel].push(page);
  });
  return levels;
}

// bestämmer level för en sida 
function determineLevel(page: any) {
  const price = page.metadata.price || 0; 
  if (price === 1) {
    return 'basic';
  } else if (price === 149) {
    return 'insight';
  } else if (price === 499) {
    return 'elite';
  } else {
    return 'default';
  }
}

// Hämtar och sorterar artiklar baserat på users subscription
async function fetchAndSortPages(userId: string) {
  const allPages = await getAllPages();
  // const userSubscription = await getUserSubscription(userId); // Använd getUserSubscription-funktionen för att hämta användarens prenumeration
  // const sortedPages = sortPagesByLevel(allPages[userSubscription.subscriptionLevel]); // Använd prenumerationsnivån för att sortera sidorna
  return sortPagesByLevel(allPages);
}

// skickar sorterade sidor till client
export const getSortedPages = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const sortedPages = await fetchAndSortPages(userId);
  res.json(sortedPages);
};
