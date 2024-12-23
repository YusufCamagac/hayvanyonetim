import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
        setMessage('Şifreler eşleşmiyor.');
        return;
    }

    try {
        const response = await registerUser(formData);
        // response.data zaten token'ı içeriyor
        const token = response.data.token;

        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');

        navigate('/');
    } catch (error) {
        console.error('Kayıt hatası:', error);
        setMessage(error.response?.data?.msg || 'Kayıt olurken bir hata oluştu.');
    }
};

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="bg-card-bg p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
          Kayıt Ol
        </h2>
        {message && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {message}
          </div>
        )}
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
              className="
                w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              className="
                w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              placeholder="E-posta adresinizi girin"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-gray-100">
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
              placeholder="Şifrenizi girin"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-gray-100"
            >
              Şifre Tekrar
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              placeholder="Şifrenizi tekrar girin"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md"
          >
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;