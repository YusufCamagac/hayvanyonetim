import React from 'react';
import { Link } from 'react-router-dom';

const AdminManagement = () => {
  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Yönetici Paneli
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 p-4 rounded-md block text-center"
          >
            Kullanıcıları Yönet
          </Link>
          <Link
            to="/admin/pets"
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 p-4 rounded-md block text-center"
          >
            Evcil Hayvanları Yönet
          </Link>
          <Link
            to="/admin/appointments"
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 p-4 rounded-md block text-center"
          >
            Randevuları Yönet
          </Link>
          <Link
            to="/admin/medical-records"
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 p-4 rounded-md block text-center"
          >
            Tıbbi Kayıtları Yönet
          </Link>
          <Link
            to="/admin/reports"
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 p-4 rounded-md block text-center"
          >
            Raporlar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;