// server/src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import { Server } from 'socket.io';
import http from 'http';
import User, { IUser} from './models/User';
import Message from './models/Message';
import jwt from 'jsonwebtoken';
import { IMessagePopulated } from './models/Message';

dotenv.config();
connectDB();

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET no está definido. Verifica tu archivo .env');
}
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Asegúrate que tu frontend corre en el 3000
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Rutas de autenticación y mensajes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Middleware para autenticar las conexiones de Socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Acceso denegado'));
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
    (socket as any).userId = decoded.id;
    next();
  } catch (err) {
    return next(new Error('Token inválido'));
  }
});

io.on('connection', async (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

 // Corrige el resultado para asegurar que TypeScript lo reconozca como un array
const messages = await Message.find()
.sort({ createdAt: -1 })
.populate<{ userId: IUser }>('userId', 'username')
.limit(100)
.lean<IMessagePopulated[]>(); // Cambiado de IMessagePopulated a IMessagePopulated[]

    if (messages && messages.length > 0) {
      const formattedMessages = messages.map((msg) => `${msg.userId.username}: ${msg.content}`);
      socket.emit('initial messages', formattedMessages.reverse());
    } else {
      socket.emit('initial messages', []);
    }

  // Manejar la recepción de mensajes desde el cliente
  socket.on('chat message', async (msg: string) => {
    const userId = (socket as any).userId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        socket.emit('error', 'Usuario no encontrado');
        return;
      }

      const newMessage = await Message.create({
        content: msg,
        userId: user._id,
      });

      io.emit('chat message', `${user.username}: ${newMessage.content}`);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;  // Cambiamos el puerto a 5002
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));