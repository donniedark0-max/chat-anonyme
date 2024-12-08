"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const User_1 = __importDefault(require("./models/User"));
const Message_1 = __importDefault(require("./models/Message"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5001', // Asegúrate que tu frontend corre en el 3000
        methods: ['GET', 'POST'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas de autenticación y mensajes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
// Middleware para autenticar las conexiones de Socket.io
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Acceso denegado'));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        socket.userId = decoded.id;
        next();
    }
    catch (err) {
        return next(new Error('Token inválido'));
    }
});
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Usuario conectado: ${socket.id}`);
    // Corrige el resultado para asegurar que TypeScript lo reconozca como un array
    const messages = yield Message_1.default.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'username')
        .limit(100)
        .lean(); // Cambiado de IMessagePopulated a IMessagePopulated[]
    if (messages && messages.length > 0) {
        const formattedMessages = messages.map((msg) => `${msg.userId.username}: ${msg.content}`);
        socket.emit('initial messages', formattedMessages.reverse());
    }
    else {
        socket.emit('initial messages', []);
    }
    // Manejar la recepción de mensajes desde el cliente
    socket.on('chat message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = socket.userId;
        try {
            const user = yield User_1.default.findById(userId);
            if (!user) {
                socket.emit('error', 'Usuario no encontrado');
                return;
            }
            const newMessage = yield Message_1.default.create({
                content: msg,
                userId: user._id,
            });
            io.emit('chat message', `${user.username}: ${newMessage.content}`);
        }
        catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    }));
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
}));
const PORT = process.env.PORT || 5001; // Cambiamos el puerto a 5002
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
