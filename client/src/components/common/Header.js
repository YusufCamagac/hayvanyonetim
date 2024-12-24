import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı rolünü JWT'den çöz ve state'e kaydet
    if (isLoggedIn && token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.user.role);
      } catch (error) {
        console.error("JWT decode hatası:", error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [isLoggedIn, token]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    setUserRole(null);
    // Kullanıcıyı, oturumu kapatmadan önceki sayfaya yönlendir
    navigate(location.pathname);
  };

  const handleMenuClick = (event) => {
    // Mobil menüde bir linke tıklandığında menünün otomatik olarak kapanmasını sağlar
    if (window.innerWidth < 640) { // Tailwind'in `sm` breakpoint'i
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
          <nav className={`px-4 py-2 rounded-lg ${isMenuOpen ? 'w-full bg-menu-bg' : ''
            }`}>
            <ul className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 text-lg"
              onClick={handleMenuClick}>
              {isLoggedIn && (
                <>
                  <li>
                    <NavLink
                      to="/pet-registration"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-link'
                          : 'hover:text-link-hover text-white'
                      }
                    >
                      Evcil Hayvan Kaydı
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/appointment-scheduling"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-link'
                          : 'hover:text-link-hover text-white'
                      }
                    >
                      Randevu Al
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/medical-records"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-link'
                          : 'hover:text-link-hover text-white'
                      }
                    >
                      Tıbbi Kayıtlar
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/reminders"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-link'
                          : 'hover:text-link-hover text-white'
                      }
                    >
                      Hatırlatıcılar
                    </NavLink>
                  </li>
                </>
              )}

              {isLoggedIn && userRole === 'admin' && (
                <>
                  <li>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-link'
                          : 'hover:text-link-hover text-white'
                      }
                    >
                      Yönetici Paneli
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/management/users"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-link'
                          : 'hover:text-link-hover text-white'
                      }
                    >
                      Kullanıcı Yönetimi
                    </NavLink>
                  </li>
                </>
              )}
              <li className="ml-0 sm:ml-8">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="hover:text-link-hover text-white"
                  >
                    Çıkış Yap
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="hover:text-link-hover text-white"
                  >
                    Giriş Yap
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;