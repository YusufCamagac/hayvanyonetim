import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ roles }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();

  if (!isLoggedIn) {
    // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir ve geldiği sayfayı state'e kaydet
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);

      // Eğer belirli roller gerekiyorsa ve kullanıcının rolü bu rolleri içermiyorsa, erişim engellendi sayfası göster
      if (roles && !roles.includes(decoded.user.role)) {
        return <div>Erişim Engellendi</div>; // Veya özel bir "Yetkisiz Erişim" sayfasına yönlendir
      }
    } catch (error) {
      console.error("JWT decode hatası:", error);
      // Token decode edilemezse, oturumu sonlandır ve login sayfasına yönlendir
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  // Kullanıcı giriş yapmış ve rolü uygunsa, içeriği göster
  return <Outlet />;
};

export default PrivateRoute;