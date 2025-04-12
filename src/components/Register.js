// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://3.144.28.166:8443';

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        username,
        password,
        email,
      });

      alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);

      if (error.response) {
        setError(`Error del servidor (${error.response.status}): ${error.response.data.message}`);
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
    <div className="register-container">
      <h2 className="register-title">Crear cuenta</h2>

      {error && <div className="register-error">{error}</div>}

      <div className="register-form">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          className="register-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="register-input"
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="register-input"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="register-button"
        >
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>
      </div>

      <p className="register-footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;
