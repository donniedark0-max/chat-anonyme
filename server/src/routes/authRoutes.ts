import express, { Request, Response } from 'express';
import { register, login } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/protected', authenticateToken, (req: Request, res: Response) => {
  res.send('This is a protected route');
});

export default router;