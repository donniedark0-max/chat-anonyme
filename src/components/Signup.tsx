import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        username,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/chatroom');
      } else {
        setError('Registro fallido');
      }
    } catch (error: any) {
      console.error('Error al crear cuenta', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Error al crear cuenta');
    }
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
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
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