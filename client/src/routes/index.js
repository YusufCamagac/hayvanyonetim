import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../components/HomePage';
import PetRegistration from '../components/PetRegistration';
import AppointmentScheduling from '../components/AppointmentScheduling';
import MedicalRecords from '../components/MedicalRecords';
import Reminders from '../components/Reminders';
import UserManagement from '../components/UserManagement';
import AdminManagement from '../components/AdminManagement';
import PetsManagement from '../components/PetsManagement';
import AppointmentsManagement from '../components/AppointmentsManagement';
import MedicalRecordsManagement from '../components/MedicalRecordsManagement';
import PrivateRoute from '../components/PrivateRoute';
import Login from '../components/Login';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import Register from '../components/Register';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ana Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* Giriş yapmış kullanıcılar için özel rotalar */}
        <Route
          path="pet-registration"
          element={
            <PrivateRoute>
              <PetRegistration />
            </PrivateRoute>
          }
        />
        <Route
          path="appointment-scheduling"
          element={
            <PrivateRoute>
              <AppointmentScheduling />
            </PrivateRoute>
          }
        />
        <Route
          path="medical-records"
          element={
            <PrivateRoute>
              <MedicalRecords />
            </PrivateRoute>
          }
        />
        <Route
          path="reminders"
          element={
            <PrivateRoute>
              <Reminders />
            </PrivateRoute>
          }
        />
        {/* Kullanıcı sadece kendi bilgilerini görebilmeli */}
        <Route
          path="user-management"
          element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Admin Layout ve Rotaları */}
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={['admin']}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="pets" element={<PetsManagement />} />
        <Route path="appointments" element={<AppointmentsManagement />} />
        <Route path="medical-records" element={<MedicalRecordsManagement />} />
      </Route>

      {/* Tanımsız rotalar için yönlendirme */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;