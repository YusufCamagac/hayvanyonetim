import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="pet-registration" element={<PetRegistration />} />
        <Route
          path="appointment-scheduling"
          element={<AppointmentScheduling />}
        />
        <Route path="medical-records" element={<MedicalRecords />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={
            <PrivateRoute roles={['admin']}>
                <AdminManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute roles={['admin']}>
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="pets"
          element={
            <PrivateRoute roles={['admin']}>
              <PetsManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="appointments"
          element={
            <PrivateRoute roles={['admin']}>
              <AppointmentsManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="medical-records"
          element={
            <PrivateRoute roles={['admin']}>
              <MedicalRecordsManagement />
            </PrivateRoute>
          }
        />
      </Route>
      {/* <Route path="*" element={<h1>404 Not Found</h1>}></Route> */}
    </Routes>
  );
};

export default AppRoutes;