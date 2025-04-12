// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserList.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://3.144.28.166:8443';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);

        if (error.response) {
          setError(`Error del servidor (${error.response.status}): ${error.response.data.message || 'No se pudo obtener la lista de usuarios.'}`);
          if (error.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        } else if (error.request) {
          setError('No se recibió respuesta del servidor. Verifica tu conexión o acepta el certificado.');
        } else {
          setError(`Error inesperado: ${error.message}`);
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
    <div className="userlist-container">
      <div className="userlist-header">
        <h2>👥 Lista de Usuarios</h2>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      {loading && <p className="loading">Cargando usuarios...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && users.length > 0 ? (
        <ul className="userlist">
          {users.map((user) => (
            <li key={user.id} className="userlist-item">
              <strong>{user.username}</strong>
              <span>{user.email}</span>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p className="empty">No hay usuarios para mostrar.</p>
      )}
    </div>
  );
};

export default UserList;
