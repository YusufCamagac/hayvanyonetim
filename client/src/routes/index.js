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
import AdminReports from '../components/AdminReports';
import UserProfile from '../components/UserProfile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ana Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="pet-registration" element={<PetRegistration />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        {/* Kullanıcı giriş yapmışsa, aşağıdaki rotalara erişebilir */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="appointment-scheduling" element={<AppointmentScheduling />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="reminders" element={<Reminders />} />
        </Route>
      </Route>

      {/* Admin Layout ve Rotaları - Sadece 'admin' rolüne sahip kullanıcılar erişebilir */}
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminLayout /></PrivateRoute>}>
        <Route index element={<AdminManagement />} />
        <Route path="management/users" element={<UserManagement />} />
        <Route path="management/pets" element={<PetsManagement />} />
        <Route path="management/appointments" element={<AppointmentsManagement />} />
        <Route path="management/medical-records" element={<MedicalRecordsManagement />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Tanımsız rotalar için yönlendirme */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;