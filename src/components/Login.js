// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import './Login.css';

const Login = ({ apiUrl = process.env.REACT_APP_API_URL || 'https://3.144.28.166:8443' }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { username, password } = formData;
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${apiUrl}/api/login`, { username, password }, {
        timeout: 10000, // 10 segundos timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username); // Guardar username para mostrar en UI
      navigate('/users');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      if (error.code === 'ECONNABORTED') {
        setError('La solicitud tardó demasiado. Por favor, intenta nuevamente.');
      } else if (error.response) {
        setError(error.response.data.message || 'Credenciales inválidas. Por favor, inténtalo de nuevo.');
      } else if (error.request) {
        setError('No se recibió respuesta del servidor. Verifica tu conexión.');
      } else {
        setError('Ocurrió un error inesperado. Por favor, inténtalo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>

      {error && (
        <div className="login-error" role="alert">
          {error}
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
          className="login-input"
          aria-label="Nombre de usuario"
          autoComplete="username"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          className="login-input"
          aria-label="Contraseña"
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="login-button"
          aria-busy={loading}
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="login-footer">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

Login.propTypes = {
  apiUrl: PropTypes.string
};

export default Login;