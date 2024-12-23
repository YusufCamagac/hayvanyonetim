import React from 'react';
import { Link } from 'react-router-dom';
import anaSayfaHero from '../assents/veteriner.jpg'; // Yeni eklenen görsel
import kediMuayene from '../assents/kedi-muayene.webp'; // Yeni eklenen görsel
import kopekMuayene from '../assents/resim3.jpg'; // Yeni eklenen görsel
import kediKopekBakim from '../assents/kedi-kopek-bakim.jpg'; // Yeni eklenen görsel

const HomePage = () => {
  return (
    <div className="bg-background">
      <section className="text-white py-20">
        <div className="container mx-auto text-center">
          <img
            src={anaSayfaHero}
            alt="Veteriner ve evcil hayvanlar"
            className="mx-auto w-full md:w-1/2 rounded-lg shadow-xl mb-10"
          />
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            Evcil Hayvan Bakımı ve Sağlık Yönetim Sistemi
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            Evcil hayvanlarınızın sağlığını ve bakımını kolayca yönetin!
          </p>
          <Link
            to="/pet-registration"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-md font-semibold"
          >
            Evcil Hayvanınızı Kaydedin
          </Link>
        </div>
      </section>

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
              <h3 className="text-xl font-semibold mb-4 text-yellow-400 mt-4">
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
              <h3 className="text-xl font-semibold mb-4 text-yellow-400 mt-4">
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
              <h3 className="text-xl font-semibold mb-4 text-yellow-400 mt-4">
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
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">
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
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">
                Kullanıcı Yönetimi
              </h3>
              <p className="text-gray-100">
                Profilinizi ve evcil hayvan bilgilerinizi yönetin.
              </p>
              <Link
                to="/user-management"
                className="text-blue-300 mt-2 inline-block hover:underline"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
            <div className="p-6 border rounded-lg shadow-md bg-card-bg">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">
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
                Panele Git
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;