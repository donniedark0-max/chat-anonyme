// server/src/routes/messageRoutes.ts
import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

router.post('/send-message', authenticateToken, sendMessage);
router.get('/messages', authenticateToken, getMessages);

export default router;