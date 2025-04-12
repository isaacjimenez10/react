// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://3.144.28.166:8443';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/login`, { username, password });

      localStorage.setItem('token', response.data.token);
      navigate('/users');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      if (error.response) {
        setError(`Error del servidor (${error.response.status}): ${error.response.data.message || 'Credenciales inválidas.'}`);
      } else if (error.request) {
        setError('No se recibió respuesta del servidor. Verifica tu conexión o acepta el certificado autofirmado.');
      } else {
        setError(`Error desconocido: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>

      {error && <div className="login-error">{error}</div>}

      <div className="login-form">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="login-input"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="login-button"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </div>

      <p className="login-footer">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;
