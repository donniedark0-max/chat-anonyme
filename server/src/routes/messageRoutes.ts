import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/send-message', authMiddleware, sendMessage);  // Protegemos la ruta con authMiddleware
router.get('/messages', getMessages);

export default router;