// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

// Usar la URL correcta de la API (HTTPS y puerto 8443)
const API_URL = process.env.REACT_APP_API_URL || 'https://3.144.28.166:8443';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Validar campos vacíos
    if (!username || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null); // Limpiar errores previos

    try {
      console.log('Enviando solicitud a:', `${API_URL}/api/login`);
      console.log('Datos enviados:', { username, password });

      const response = await axios.post(`${API_URL}/api/login`, {
        username,
        password,
      });

      console.log('Respuesta del servidor:', response.data);

      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);
      navigate('/users');
    } catch (error) {
      console.error('Error en login:', error);
      if (error.response) {
        // El servidor respondió con un error (por ejemplo, 401, 500)
        setError(`Error del servidor: ${error.response.status} - ${error.response.data.message || 'No se pudo iniciar sesión. Verifica tus credenciales.'}`);
      } else if (error.request) {
        // No se recibió respuesta del servidor
        setError('No se recibió respuesta del servidor. Verifica tu conexión a Internet o acepta el certificado autofirmado en el navegador.');
      } else {
        // Error al configurar la solicitud
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
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
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;