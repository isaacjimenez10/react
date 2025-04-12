// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://3.144.28.166:3000';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !email) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/register`, {
        username,
        password,
        email,
      });
      setError(null);
      alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      if (error.response) {
        setError(`Error del servidor: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        setError('No se recibió respuesta del servidor. Verifica tu conexión a Internet.');
      } else {
        setError(`Error: ${error.message}`);
      }
      console.error('Error al registrar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Registrarse</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Cargando...' : 'Registrarse'}
      </button>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;