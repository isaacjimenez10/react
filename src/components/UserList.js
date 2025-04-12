// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserList.css';

// Usar la URL correcta de la API (HTTPS y puerto 8443)
const API_URL = process.env.REACT_APP_API_URL || 'https://3.144.28.166:8443';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.');
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        console.log('Enviando solicitud a:', `${API_URL}/api/users`);
        console.log('Token usado:', token);

        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Respuesta del servidor:', response.data);

        setUsers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        if (error.response) {
          // El servidor respondió con un error (por ejemplo, 401, 500)
          setError(`Error del servidor: ${error.response.status} - ${error.response.data.message || 'No se pudo obtener la lista de usuarios.'}`);
          if (error.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
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
    fetchUsers();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="user-list-container">
      <h2>Lista de Usuarios</h2>
      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No hay usuarios para mostrar.</p>
      )}
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default UserList;