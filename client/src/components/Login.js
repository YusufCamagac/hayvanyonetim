import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../api';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!username || !password) {
      setMessage('Kullanıcı adı ve şifre alanları zorunludur!');
      return;
    }

    try {
      const response = await loginUser({ username, password });
      
      // Sunucudan gelen yanıtı ve token'ı kontrol et
      if (response && response.token) {
        const token = response.token;

        if (typeof token === 'string' && token.trim() !== '') {
          localStorage.setItem('token', token);
          localStorage.setItem('isLoggedIn', 'true');

          const decodedToken = jwtDecode(token);
          if (decodedToken.user.role === 'admin') {
            navigate('/admin');
          } else {
            const from = location.state?.from?.pathname || '/';
            navigate(from);
          }
        } else {
          console.error('Hata: Sunucudan gelen token geçersiz:', token);
          setMessage('Oturum açma başarısız: Geçersiz token.');
        }
      } else {
        console.error('Hata: Sunucudan token gelmedi veya yanıt hatalı.');
        setMessage('Oturum açma başarısız: Sunucu yanıt vermedi.');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      if (error.response) {
        // Sunucudan gelen hata mesajını kullan
        setMessage(error.response.data.msg || 'Oturum açma başarısız: Sunucu hatası.');
      } else if (error.request) {
        // İstek yapılmış ama yanıt alınamamış
        setMessage('Oturum açma başarısız: Sunucuya erişilemiyor.');
      } else {
        // Diğer hatalar
        setMessage('Oturum açma başarısız: Bilinmeyen hata.');
      }
      }
    };
  

  return (
    <div className="bg-background p-4 min-h-screen flex justify-center items-center">
      <div className="bg-card-bg p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-headings">Giriş Yap</h2>
        {message && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {message}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2 text-gray-100">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              required
              placeholder="Kullanıcı adınızı girin"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              required
              placeholder="Şifrenizi girin"
            />
          </div>
          <button
            type="submit"
            className="bg-accent hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md"
          >
            Giriş Yap
          </button>
        </form>
        <div className="mt-4 text-gray-100">
          Hesabınız yok mu?{' '}
          <Link to="/register" className="text-link hover:underline">
            Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;