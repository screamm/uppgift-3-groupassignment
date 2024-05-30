//JESSICA - skapa innehållsidor, välja nivå de ska visas för
// någon form av början, behöver API nyckel för att kunna testa
// Testa i Postman
// Starta din Express-server genom att köra din applokala server.
// Öppna Postman och skapa en ny request genom att klicka på "New" och sedan "Request".
// Ange den URL som din Express-server lyssnar på, t.ex. http://localhost:port/api/getSortedPages, där port är den port din server lyssnar på och /api/getSortedPages är den route du vill testa.
// Välj HTTP-metoden du vill använda (vanligtvis GET eller POST).
// Om din ruta förväntar sig query-parametrar eller kroppsinnehåll, fyll i dem under fliken "Params" eller "Body" i Postman.
// Tryck på "Send" för att skicka förfrågan till din Express-server.
// Se till att servern svarar korrekt och returnerar de förväntade data.

import { Request, Response } from 'express';
import { getUserSubscription, updateUserSubscription } from './subscription.controllers'; 
const stripe = require('stripe')('sk_test_your_stripe_secret_key');

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
//   const userSubscription = await getUserSubscription(userId); // Använd getUserSubscription-funktionen för att hämta användarens prenumeration
//   const sortedPages = sortPagesByLevel(allPages[userSubscription.subscriptionLevel]); // Använd prenumerationsnivån för att sortera sidorna
//   return sortedPages;
}

// skickar sorterade sidor till client
export const getSortedPages = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const sortedPages = await fetchAndSortPages(userId);
    res.json(sortedPages);
};
