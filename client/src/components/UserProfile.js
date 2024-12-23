import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../api';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Kullanıcı ID'sini al
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '', // Yeni şifre için
      confirmPassword: '', // Yeni şifre onayı için
      role: ''
    });
    
    useEffect(() => {
      const fetchUser = async () => {
        setIsLoading(true);
        try {
          const response = await getUserById(id);
          setUser(response.data);
          // Düzenleme modu için formData'yı ayarla
          setFormData({
            username: response.data.username,
            email: response.data.email,
            role: response.data.role,
            password: '', // Güvenlik için mevcut şifreyi gösterme
            confirmPassword: '',
          });
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
          setError('Kullanıcı bilgileri alınamadı.');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUser();
    }, [id]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
          setMessage('Şifreler eşleşmiyor.');
          return;
        }
      
        const updatedData = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          ...(formData.password && { password: formData.password }),
        };
      
        try {
          const response = await updateUser(id, updatedData);
          setUser(response.data);
          setIsEditing(false);
          setMessage('Profil başarıyla güncellendi.');
          setTimeout(() => setMessage(''), 3000);
        } catch (error) {
          console.error('Güncelleme hatası:', error);
          setError('Profil güncellenirken bir hata oluştu.');
        }
      };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
          // Düzenleme modundan çıkarken formData'yı sıfırla
          setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            password: '',
            confirmPassword: '',
          });
        }
      };

      if (isLoading) {
        return <div>Yükleniyor...</div>;
      }
    
      if (error) {
        return <div>Hata: {error}</div>;
      }
    
      if (!user) {
        return <div>Kullanıcı bilgileri bulunamadı.</div>;
      }

      return (
        <div className="bg-background p-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Kullanıcı Profili
            </h2>
            {message && (
              <div className="mb-4 p-2 bg-green-100 text-green-700">{message}</div>
            )}
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
    
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block mb-2 text-gray-100">
                    Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                    placeholder="Kullanıcı adınızı girin"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-gray-100">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                    placeholder="E-posta adresinizi girin"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-gray-100">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Yeni şifrenizi girin"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-gray-100"
                  >
                    Yeni Şifre Tekrar
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Yeni şifrenizi tekrar girin"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md"
                >
                  Değişiklikleri Kaydet
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md ml-2"
                >
                  İptal
                </button>
              </form>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-100">Kullanıcı Adı:</label>
                  <span className="text-gray-100">{user.username}</span>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-100">E-posta:</label>
                  <span className="text-gray-100">{user.email}</span>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-100">Rol:</label>
                  <span className="text-gray-100">{user.role}</span>
                </div>
                <button
                  onClick={toggleEditMode}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md"
                >
                  Profili Düzenle
                </button>
              </>
            )}
          </div>
        </div>
      );
    };
    
    export default UserProfile;