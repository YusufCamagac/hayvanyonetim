import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar alınamadı:', error);
      setError('Kullanıcılar alınamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '',
    });
    setEditMode(true);
    setAddMode(false);
    setMessage('');
    setError(null);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) {
      setIsLoading(true);
      setError(null);
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
        setSelectedUser(null);
        setEditMode(false);
        setAddMode(false);
        setMessage('Kullanıcı başarıyla silindi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Kullanıcı silinemedi:', error);
        setError('Kullanıcı silinemedi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (editMode) {
      try {
        const response = await updateUser(selectedUser.id, formData);
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? response.data : user
          )
        );
        setSelectedUser(null);
        setEditMode(false);
        setMessage('Kullanıcı başarıyla güncellendi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Kullanıcı güncellenemedi:', error);
        setError('Kullanıcı güncellenemedi.');
      } finally {
        setIsLoading(false);
      }
    } else if (addMode) {
      try {
        const response = await createUser(formData);
        setUsers([...users, response.data]);
        setAddMode(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'user',
        });
        setMessage('Kullanıcı başarıyla eklendi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Kullanıcı eklenemedi:', error);
        setError('Kullanıcı eklenemedi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAdd = () => {
    setAddMode(true);
    setEditMode(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
    });
    setMessage('');
    setError(null);
  };

  const handleCancel = () => {
    setAddMode(false);
    setEditMode(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
    });
    setMessage('');
    setError(null);
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Kullanıcı Yönetimi
        </h2>

        {isLoading && <div className="mb-4 p-2 text-gray-100">Yükleniyor...</div>}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700">{message}</div>
        )}

        <div className="mb-4">
          <button
            onClick={handleAdd}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md"
          >
            Yeni Kullanıcı Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-lg shadow-md bg-card-bg"
            >
              <p className="font-semibold text-gray-100">
                Kullanıcı Adı: {user.username}
              </p>
              <p className="text-gray-100">E-posta: {user.email}</p>
              <p className="text-gray-100">Rol: {user.role}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {(editMode || addMode) && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-100">
              {editMode ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-gray-100"
                >
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="
                    w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none  focus:ring-2  focus:ring-yellow-400"
                  required
                  placeholder="Kullanıcı adı"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-gray-100"
                >
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 "
                  required
                  placeholder="E-posta adresi"
                />
              </div>
              {addMode && (
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-gray-100"
                  >
                    Şifre
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                    placeholder="Şifre"
                  />
                </div>
              )}
              <div>
                <label htmlFor="role" className="block mb-2 text-gray-100">
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="user">Kullanıcı</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center">
                <button
                  type="submit"
                  className={`bg-${
                    editMode ? 'blue' : 'yellow'
                  }-500 hover:bg-${
                    editMode ? 'blue' : 'yellow'
                  }-600 text-white px-4 py-2 rounded-md mr-2`}
                >
                  {editMode ? 'Kaydet' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;