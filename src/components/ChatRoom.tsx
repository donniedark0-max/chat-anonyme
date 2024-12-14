// src/components/ChatRoom.tsx
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

interface IExtendedMessage {
  userId: string;
  username: string;
  content: string;
  color: string;
  userNumber: string;
}

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IExtendedMessage[]>([]);
  const [canSend, setCanSend] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    socket.current = io('http://localhost:5001', {
      auth: {
        token: token,
      },
    });

    socket.current.on('initial messages', (msgs: IExtendedMessage[]) => {
      setMessages(msgs);
    });

    socket.current.on('chat message', (msg: IExtendedMessage) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.current.on('user assignment', (data: { canSend: boolean }) => {
      setCanSend(data.canSend);
    });

    socket.current.on('error', (err: string) => {
      console.error('Socket error:', err);
      alert(err);
      navigate('/login');
    });

    socket.current.on('logged out', () => {
      // Borrar credenciales y volver a login
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [token, navigate, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) {
      alert('No puedes enviar mensajes, límite de usuarios alcanzado.');
      return;
    }
    if (socket.current && message.trim() !== '') {
      socket.current.emit('chat message', message.trim());
      setMessage('');
    }
  };

  const handleLogout = () => {
    if (socket.current) {
      socket.current.emit('logout');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
    }
  };

  const formatMessage = (msg: IExtendedMessage) => {
    const isCurrentUser = msg.userId === userId;
    const usernameNumber = `${msg.username}${msg.userNumber}`;
    // isCurrentUser: mensaje a la derecha, "{content} :[{usernameNumber}]"
    // Otros: izquierda, "[{usernameNumber}]: {content}"
    if (isCurrentUser) {
      // Usamos un contenedor flex
      return (
        <div style={{display: 'flex', justifyContent: 'space-between', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
          <span style={{marginRight: '8px'}}>{msg.content}</span>
          <span>:[{usernameNumber}]</span>
        </div>
      );
    } else {
      // Otros usuarios, "[{usernameNumber}]: {content}" en una sola línea
      return (
        <p style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
          [{usernameNumber}]: {msg.content}
        </p>
      );
    }
  };

  return (
    <div className="chatroom-container relative bg-black text-white min-h-screen flex flex-col">
      {/* Fondo con bg-contain */}
      <div
        className="absolute inset-0 bg-no-repeat bg-contain bg-center opacity-30"
        style={{
          backgroundImage: "url('/images/chatroom-img.webp')",
        }}
      ></div>

      <div className="relative z-10 flex flex-col w-full px-4 md:px-8 py-8 h-screen justify-between items-center">
        {/* Botón de cerrar sesión arriba a la izquierda */}
        <div className="absolute top-8 left-8">
          <button
            onClick={handleLogout}
            className="bg-red-800 text-white py-2 px-4 rounded-lg"
          >
            Cerrar Sesión
          </button>
        </div>

        <h2 className="text-center text-4xl md:text-6xl text-red-800 mb-8">
          Bienvenido a la sala de chat :D
        </h2>

        <div
          id="chat-container"
          className="overflow-y-auto w-full max-w-4xl p-4 bg-black bg-opacity-70 rounded-lg flex-grow mb-4"
        >
          {messages.map((msg, index) => {
            const isCurrentUser = (msg.userId === userId);
            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div className="max-w-xs px-4 py-2 rounded-lg" style={{ color: msg.color }}>
                  {formatMessage(msg)}
                </div>
              </div>
            );
          })}
        </div>

        <form
          id="chat-form"
          className="w-full max-w-4xl flex items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            id="message-input"
            placeholder="Escribe tu mensaje (max 600 chars)..."
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= 600) {
                setMessage(e.target.value);
              }
            }}
            className="p-2 flex-grow rounded-lg border border-gray-400 text-black"
            required
            disabled={!canSend}
          />
          <button
            type="submit"
            className="bg-red-800 text-white py-2 px-4 rounded-lg ml-2"
            disabled={!canSend}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;