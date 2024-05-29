import express from 'express';

const articleRouter = express.Router();

// Hämta användarens prenumerationsnivå
articleRouter.get('/articles'); //, FUNKTIONSNAMNFRÅNCONTROLLERS);

// Uppdatera användarens prenumerationsnivå
articleRouter.post('/articles');//, FUNKTIONSNAMNFRÅNCONTROLLERS);

export default articleRouter;
