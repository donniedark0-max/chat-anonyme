import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import Signup from './components/Signup';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirigir a login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatroom" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
};

export default App;