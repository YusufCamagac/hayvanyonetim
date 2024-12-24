import React from 'react';
import { Link } from 'react-router-dom';
import anaSayfaHero from '../assents/veteriner.jpg';
import kediMuayene from '../assents/kedi-muayene.webp';
import kopekMuayene from '../assents/resim3.jpg';
import kediKopekBakim from '../assents/kedi-kopek-bakim.jpg';

const HomePage = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div className="bg-background">
      <section className="text-white py-20">
        <div className="container mx-auto text-center">
          <img
            src={anaSayfaHero}
            alt="Veteriner kliniğinde bir veteriner, köpeği muayene ediyor."
            className="mx-auto w-full md:w-1/2 rounded-lg shadow-xl mb-10"
          />
          <h1 className="text-4xl font-bold mb-4 text-headings">
            Evcil Hayvan Bakımı ve Sağlık Yönetim Sistemi
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            Evcil hayvanlarınızın sağlığını ve bakımını kolayca yönetin!
          </p>
          {/* Değişiklik burada başlıyor */}
          {isLoggedIn ? (
            <Link
              to="/manage-pets"
              className="bg-link hover:bg-link-hover text-gray-900 px-6 py-3 rounded-md font-semibold"
            >
              Hayvanları Yönet
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-link hover:bg-link-hover text-gray-900 px-6 py-3 rounded-md font-semibold"
            >
              Kayıt Ol
            </Link>
          )}
          {/* Değişiklik burada bitiyor */}
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">Özellikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-md bg-card-bg">
              <img
                src={kopekMuayene}
                alt="Evcil Hayvan Kaydı"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-xl font-semibold mb-4 text-link mt-4">
                Evcil Hayvan Kaydı
              </h3>
              <p className="text-gray-100">
                Evcil hayvanlarınızın tüm bilgilerini tek bir yerde tutun.
              </p>
              <Link
                to="/pet-registration"
                className="text-blue-300 mt-2 inline-block hover:underline"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
            <div className="p-6 border rounded-lg shadow-md bg-card-bg">
              <img
                src={kediMuayene}
                alt="Randevu Zamanlama"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-xl font-semibold mb-4 text-link mt-4">
                Randevu Zamanlama
              </h3>
              <p className="text-gray-100">
                Veteriner ve tımarlayıcı randevularını kolayca alın.
              </p>
              <Link
                to="/appointment-scheduling"
                className="text-blue-300 mt-2 inline-block hover:underline"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
            <div className="p-6 border rounded-lg shadow-md bg-card-bg">
              <img
                src={kediKopekBakim}
                alt="Tıbbi Kayıtlar"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-xl font-semibold mb-4 text-link mt-4">
                Tıbbi Kayıtlar
              </h3>
              <p className="text-gray-100">
                Evcil hayvanlarınızın tüm bilgilerini tek bir yerde tutun.
              </p>
              <Link
                to="/medical-records"
                className="text-blue-300 mt-2 inline-block hover:underline"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
            <div className="p-6 border rounded-lg shadow-md bg-card-bg">
              <h3 className="text-xl font-semibold mb-4 text-link mt-4">
                Hatırlatıcılar
              </h3>
              <p className="text-gray-100">
                Önemli ilaç ve aşıları asla unutmayın.
              </p>
              <Link
                to="/reminders"
                className="text-blue-300 mt-2 inline-block hover:underline"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
            <div className="p-6 border rounded-lg shadow-md bg-card-bg">
              <h3 className="text-xl font-semibold mb-4 text-link mt-4">
                Kullanıcı Profili
              </h3>
              <p className="text-gray-100">
                Profilinizi ve evcil hayvan bilgilerinizi yönetin.
              </p>
              <Link
                to="/profile"
                className="text-blue-300 mt-2 inline-block hover:underline"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
            <div className="p-6 border rounded-lg shadow-md bg-card-bg">
              <h3 className="text-xl font-semibold mb-4 text-link mt-4">
                Yönetici Yönetimi
              </h3>
              <p className="text-gray-100">
                Kullanıcıları, evcil hayvanları, randevuları ve tıbbi kayıtları
                yönetin.
              </p>
              <Link
                to="/admin"
                className="text-blue-300 mt-2 inline-block hover:underline"
              >
                Yönetici Paneli
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;