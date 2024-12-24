import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import defaultAvatar from '../assents/avatar.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.user);
      } catch (error) {
        console.error("JWT decode hatası:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [isLoggedIn, token]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    setUser(null);
    navigate(location.pathname === '/' ?  '/' : '/');
    window.location.reload();

  };

  const handleMenuClick = () => {
    if (window.innerWidth < 640) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-header-bg text-gray-900 p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex-grow flex justify-center sm:justify-start mb-4 sm:mb-0">
          <Link to="/" className="text-2xl font-bold text-link">
            Evcil Hayvan Bakım Sistemi
          </Link>
        </div>

        <button
          className="sm:hidden border border-gray-900 rounded p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-6 w-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        <div
          className={`flex flex-col sm:flex-row w-full sm:w-auto ${isMenuOpen ? '' : 'hidden sm:flex'
            } mt-4 sm:mt-0`}
        >
          <nav className={`px-4 py-2 rounded-lg ${isMenuOpen ? 'w-full bg-menu-bg' : ''}`}>
            <ul className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 text-lg" onClick={handleMenuClick}>
              {/* Diğer menü öğeleri */}
              <li>
                <NavLink to="/pet-registration" className={({ isActive }) => isActive ? 'text-link' : 'hover:text-link-hover text-white'}>
                  Evcil Hayvan Kaydı
                </NavLink>
              </li>
              <li>
                <NavLink to="/appointment-scheduling" className={({ isActive }) => isActive ? 'text-link' : 'hover:text-link-hover text-white'}>
                  Randevu Al
                </NavLink>
              </li>
              <li>
                <NavLink to="/medical-records" className={({ isActive }) => isActive ? 'text-link' : 'hover:text-link-hover text-white'}>
                  Tıbbi Kayıtlar
                </NavLink>
              </li>
              <li>
                <NavLink to="/reminders" className={({ isActive }) => isActive ? 'text-link' : 'hover:text-link-hover text-white'}>
                  Hatırlatıcılar
                </NavLink>
              </li>
              {/* Kullanıcı menüsü */}
              {isLoggedIn && user ? (
                <li className="relative group">
                  <div className="flex items-center cursor-pointer">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                      <img src={defaultAvatar} alt="Default Avatar" className="w-8 h-8 rounded-full" />
                    )}
                    <span className="ml-2 text-white">{user.username}</span>
                  </div>
                  <ul className="absolute hidden group-hover:block bg-menu-bg text-white p-2 rounded-md space-y-2">
                    <li>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        Profil
                      </Link>
                    </li>
                    <li>
                      <Link to="/manage-pets" onClick={() => setIsMenuOpen(false)}>
                        Hayvanlar
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="w-full text-left">
                        Çıkış Yap
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li>
                  <Link to="/login" className="hover:text-link-hover text-white" onClick={() => setIsMenuOpen(false)}>
                    Giriş Yap
                  </Link>
                </li>
              )}
              {/* Admin menüsü */}
              {isLoggedIn && user && user.role === 'admin' && (
                <>
                  <li>
                    <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-link' : 'hover:text-link-hover text-white'}>
                      Yönetici Paneli
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;