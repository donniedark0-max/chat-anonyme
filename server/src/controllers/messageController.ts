import { RequestHandler } from 'express';
import Message from '../models/Message'; // Asegúrate de tener este modelo creado

export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId; // Este viene del middleware de autenticación

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
      .populate('userId', 'username'); // Asumiendo que quieres también la info del usuario

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes', error });
  }
};