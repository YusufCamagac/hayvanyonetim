import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ roles }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);

      if (roles && !roles.includes(decoded.user.role)) {
        return <div>Yetkisiz Erişim</div>; // Özel bir "Yetkisiz Erişim" sayfasına yönlendirebilirsiniz.
      }
    } catch (error) {
      console.error("JWT decode hatası:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;