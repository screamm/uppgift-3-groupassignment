import express from 'express';
import { getUserSubscription, updateUserSubscription } from '../controllers/userController';

const router = express.Router();

// Hämta användarens prenumerationsnivå
router.get('/subscription', getUserSubscription);

// Uppdatera användarens prenumerationsnivå
router.post('/subscription', updateUserSubscription);

export default router;
