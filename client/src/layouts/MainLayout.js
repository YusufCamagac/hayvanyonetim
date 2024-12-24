import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="flex-grow px-4 py-8 container mx-auto">
          <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;