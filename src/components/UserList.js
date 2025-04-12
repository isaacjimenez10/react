// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserList.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://3.144.28.166:8443';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError('Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingUser) {
        await axios.put(`${API_URL}/api/users/${editingUser.id}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/users`, formData, config);
      }
      setFormData({ username: '', email: '', password: '' });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError('Error al guardar usuario.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, password: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError('Error al eliminar usuario.');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="userlist-container">
      <div className="userlist-header">
        <h2>👥 Usuarios</h2>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      </div>

      <div className="form-container">
        <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
        <input name="username" placeholder="Usuario" value={formData.username} onChange={handleInputChange} />
        <input name="email" type="email" placeholder="Correo" value={formData.email} onChange={handleInputChange} />
        <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleInputChange} />
        <div className="form-buttons">
          <button onClick={handleCreateOrUpdate}>{editingUser ? 'Actualizar' : 'Crear'}</button>
          {editingUser && <button onClick={handleCancelEdit} className="cancel-button">Cancelar</button>}
        </div>
      </div>

      {loading && <p>Cargando usuarios...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && users.length > 0 && (
        <ul className="userlist">
          {users.map((user) => (
            <li key={user.id} className="userlist-item">
              <strong>{user.username}</strong>
              <span>{user.email}</span>
              <div className="actions">
                <button onClick={() => handleEdit(user)} className="edit-button">✏️</button>
                <button onClick={() => handleDelete(user.id)} className="delete-button">🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
