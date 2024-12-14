// server/src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import { Server } from 'socket.io';
import http from 'http';
import User, { IUser } from './models/User';
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
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Mapa global: userId -> {color: string; index: number}
const userMap = new Map<string, {color: string; index: number}>();
let userCount = 0; 
const MAX_USERS = 100;

function generateColor() {
  const hue = Math.floor(Math.random() * 360); 
  return `hsl(${hue}, 100%, 70%)`;
}

function assignUserColorAndIndex(userId: string) {
  if (!userMap.has(userId)) {
    // Solo asignamos si no está y hay cupo
    if (userCount < MAX_USERS) {
      const index = userCount;
      userCount++;
      const color = generateColor();
      userMap.set(userId, {color, index});
    } 
    // Si supera 100 usuarios, no se asigna color/índice
  }
}

function freeUserColor(userId: string) {
  if (userMap.has(userId)) {
    userMap.delete(userId);
    userCount--;
  }
}

function getUserColorAndNumber(userId: string) {
  const userData = userMap.get(userId);
  if (!userData) {
    return { color: 'white', number: '???', canSend: false };
  } else {
    const userNumber = (userData.index + 1).toString().padStart(3, '0');
    return { color: userData.color, number: userNumber, canSend: true };
  }
}

async function emitInitialMessages(socket: any) {
  const messages = await Message.find()
    .sort({ createdAt: -1 })
    .populate<{ userId: IUser }>('userId', 'username')
    .limit(100)
    .lean<IMessagePopulated[]>();

  if (Array.isArray(messages) && messages.length > 0) {
    const formattedMessages = messages.map((msg) => {
      const {color, number} = getUserColorAndNumber(msg.userId._id.toString());
      return {
        userId: msg.userId._id.toString(),
        username: msg.userId.username,
        content: msg.content,
        color,
        userNumber: number,
      };
    });
    socket.emit('initial messages', formattedMessages.reverse());
  } else {
    socket.emit('initial messages', []);
  }
}

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
  const userId = (socket as any).userId;
  
  assignUserColorAndIndex(userId);

  console.log(`Usuario conectado: ${socket.id}, userId: ${userId}`);

  await emitInitialMessages(socket);

  const {canSend} = getUserColorAndNumber(userId);
  socket.emit('user assignment', { canSend });

  socket.on('chat message', async (msg: string) => {
    const { color, number, canSend } = getUserColorAndNumber(userId);
    if (!canSend) {
      socket.emit('error', 'Límite de usuarios alcanzado, no puedes enviar mensajes.');
      return;
    }

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

      io.emit('chat message', {
        userId: userId,
        username: user.username,
        content: newMessage.content,
        color: color,
        userNumber: number,
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  });

  socket.on('logout', () => {
    // Al hacer logout, liberamos color/número
    freeUserColor(userId);
    socket.emit('logged out');
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}, userId: ${userId}`);
    // NO liberamos el color en disconnect, solo en logout
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));