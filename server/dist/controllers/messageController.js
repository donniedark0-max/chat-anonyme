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
exports.getMessages = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(400).json({ message: 'Usuario no autenticado' });
            return;
        }
        const message = yield Message_1.default.create({
            content,
            userId,
        });
        res.status(201).json({ message: 'Mensaje enviado exitosamente', data: message });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al enviar el mensaje', error });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message_1.default.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'username')
            .limit(100)
            .lean(); // Cambiado de IMessagePopulated a IMessagePopulated[]
        if (!messages) {
            res.json({ messages: [] });
            return;
        }
        const formattedMessages = messages.map((msg) => `${msg.userId.username}: ${msg.content}`);
        res.json({ messages: formattedMessages.reverse() });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los mensajes', error });
        return;
    }
});
exports.getMessages = getMessages;
