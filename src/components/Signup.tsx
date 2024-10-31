import React, { useState } from 'react';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría tu lógica para manejar el registro, como una llamada a una API
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="signup-container bg-black text-white flex flex-col items-center justify-center min-h-screen">
         <img
        src="/images/signup-img.jpg"
        alt="Imagen de Fondo"
        className="lg:block hidden absolute bottom-0 right-0 mb-4 mr-4"
      />
      <h2 className="text-white text-3xl text-center">Sign Up</h2>
      <p className="text-yellow-50 text-center mt-2">Crea tu cuenta para empezar a mandar mensajes</p>
      <form onSubmit={handleSubmit} className="bg-white text-black px-8 pt-6 pb-8 rounded-3xl shadow-md mt-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Ingresa tu username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none text-center"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none text-center"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none text-center"
            required
          />
        </div>
        <div className="w-full flex justify-center">
        <button type="submit" className="bg-red-200 hover:bg-black text-white font-bold py-2 px-4 rounded-3xl">
          Crear Cuenta
        </button>
        </div>
      </form>
      <p className="text-red-300 text-xs mt-4">
        Si olvidaste tu contraseña, ¡crea otra cuenta!
      </p>
    </div>
  );
};

export default Signup;