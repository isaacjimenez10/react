// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

// Usar la URL correcta de la API (HTTPS y puerto 8443)
const API_URL = process.env.REACT_APP_API_URL || 'https://3.144.28.166:8443';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validar campos vacíos
    if (!username || !password || !email) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Validar formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setError(null); // Limpiar errores previos

    try {
      console.log('Enviando solicitud a:', `${API_URL}/api/register`);
      console.log('Datos enviados:', { username, password, email });

      const response = await axios.post(`${API_URL}/api/register`, {
        username,
        password,
        email,
      });

      console.log('Respuesta del servidor:', response.data);

      alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      if (error.response) {
        // El servidor respondió con un error (por ejemplo, 400, 500)
        setError(`Error del servidor: ${error.response.status} - ${error.response.data.message}`);
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