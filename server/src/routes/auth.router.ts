import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controllers';

const router = Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.post('/logout', logoutUser as any);

export default router;
