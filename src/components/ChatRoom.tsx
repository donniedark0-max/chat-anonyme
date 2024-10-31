import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const socket = useRef(io('http://localhost:3000')).current; // Cambia la URL si es necesario

  useEffect(() => {
    // Manejar la recepción de mensajes
    socket.on('chat message', (msg: string) => {
      if (chatContainerRef.current) {
        const messageItem = document.createElement('p');
        messageItem.textContent = msg;
        chatContainerRef.current.appendChild(messageItem);
      }
    });

    return () => {
      socket.disconnect(); // Desconectar socket al desmontar el componente
    };
  }, [socket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit('chat message', message);
    setMessage(''); // Limpiar el input después de enviar
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
      <div id="chat-container" ref={chatContainerRef} className="overflow-y-auto h-96 w-full p-4 bg-black">
        {/* Aquí se irán añadiendo los mensajes */}
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