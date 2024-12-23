import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-header-bg text-gray-100 p-6 mt-12">
      <div className="container mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} Evcil Hayvan Bakım Sistemi - Tüm Hakları Saklıdır</p>
        <div className="mt-2">
          <a href="/gizlilik-politikasi" className="hover:text-link-hover mr-4">
            Gizlilik Politikası
          </a>
          <a href="/kullanim-kosullari" className="hover:text-link-hover">
            Kullanım Koşulları
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;