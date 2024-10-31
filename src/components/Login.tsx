import React, { useState } from 'react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría tu lógica para manejar el login, como una llamada a una API
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className="login-container bg-black text-white flex flex-col items-center justify-center min-h-screen">
        <img
        src="/images/login-img.webp"
        alt="Imagen de Fondo"
        className="lg:block hidden absolute bottom-0 right-0 mb-4 mr-4"
      />
      <h2 className="text-yellow-50 text-3xl text-center">Iniciar Sesión</h2>
      <p className="text-yellow-50 text-center mt-2">Inicia sesión para mandar tu primer o último mensaje</p>
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
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none text-center"
            required
          />
        </div>
        <div className="w-full flex justify-center">
        <button type="submit" className="bg-black hover:bg-pink-950 text-white font-bold py-2 px-4 rounded-3xl">
          Iniciar Sesión
        </button>
        </div>
      </form>
      <p className="text-yellow-100 text-center mt-4">
        Si no tienes cuenta,{' '}
        <a href="/signup" className="text-yellow-200 underline">
          crea una.
        </a>
      </p>
    </div>
  );
};

export default Login;