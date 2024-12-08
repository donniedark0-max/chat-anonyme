// src/components/ChatRoom.tsx
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';


const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Inicializar Socket.io con el token
    socket.current = io('http://localhost:5001', { // Cambiado a puerto 5002
      auth: {
        token: token,
      },
    });

    // Manejar la recepción de mensajes
    socket.current.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Manejar la recepción de mensajes históricos
    socket.current.on('initial messages', (msgs: string[]) => {
      setMessages(msgs);
    });

    // Manejar errores de Socket.io
    socket.current.on('error', (err: string) => {
      console.error('Socket error:', err);
      alert(err);
      navigate('/login');
    });

    return () => {
      socket.current?.disconnect(); // Desconectar socket al desmontar el componente
    };
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket.current && message.trim() !== '') {
      socket.current.emit('chat message', message.trim());
      setMessage(''); // Limpiar el input después de enviar
    }
  };

  return (
    <div className="chatroom-container relative bg-black text-white min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-center text-6xl text-red-800">Bienvenido a la sala de chat :D</h2>

      <img
        src="/images/chatroom-img.webp"
        alt="Imagen de Fondo"
        className="lg:block hidden absolute bottom-0 right-0 mb-4 mr-4"
      />

      {/* Contenedor del chat */}
      <div id="chat-container" className="overflow-y-auto h-96 w-full p-4 bg-black">
      {messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
      </div>

      {/* Formulario para enviar mensajes */}
      <form id="chat-form" className="text-center w-full mt-4" onSubmit={handleSubmit}>
        <input
          type="text"
          id="message-input"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 w-4/5 rounded-lg border border-gray-400"
          required
        />
        <button type="submit" className="bg-red-800 text-white py-2 px-4 rounded-lg ml-2">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;