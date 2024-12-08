// server/src/controllers/messageController.ts
import { RequestHandler } from 'express';
import Message, { IMessagePopulated } from '../models/Message';
import User, { IUser } from '../models/User';
export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ message: 'Usuario no autenticado' });
      return;
    }

    const message = await Message.create({
      content,
      userId,
    });

    res.status(201).json({ message: 'Mensaje enviado exitosamente', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el mensaje', error });
  }
};

export const getMessages: RequestHandler = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .populate<{ userId: IUser }>('userId', 'username')
      .limit(100)
      .lean<IMessagePopulated[]>(); // Cambiado de IMessagePopulated a IMessagePopulated[]

    if (!messages) {
      res.json({ messages: [] });
      return;
    }

    const formattedMessages = messages.map((msg) => `${msg.userId.username}: ${msg.content}`);
    res.json({ messages: formattedMessages.reverse() });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes', error });
    return;
  }
};