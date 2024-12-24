import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPets } from '../api'; // api.js'de getPets fonksiyonunu güncellediğimizden emin olun
import { jwtDecode } from "jwt-decode";

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const decoded = jwtDecode(token);
        const ownerId = decoded.user.id;
        const response = await getPets(ownerId); // getPets fonksiyonuna ownerId'yi gönder
        setPets(response.data);
      } catch (error) {
        console.error('Evcil hayvanlar alınamadı:', error);
        setError('Evcil hayvanlar alınamadı.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
        fetchPets();
    }
  }, [token]);

  if (loading) {
    return <div className="text-white">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Hayvanlarım</h2>
        <Link to="/pet-registration" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
          Yeni Evcil Hayvan Ekle
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet.id} className="bg-card-bg border border-gray-600 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-100">{pet.name}</h3>
                <p className="text-gray-100">Tür: {pet.species}</p>
                <p className="text-gray-100">Yaş: {pet.age}</p>
                <p className="text-gray-100">Cins: {pet.breed}</p>
                <p className="text-gray-100">Cinsiyet: {pet.gender}</p>
                <div className="mt-4">
                  <Link to={`/medical-records/${pet.id}`} className="text-blue-400 hover:text-blue-600 mr-2">
                    Tıbbi Kayıtlar
                  </Link>
                  <Link to={`/appointments/${pet.id}`} className="text-blue-400 hover:text-blue-600 mr-2">
                    Randevular
                  </Link>
                  <Link to={`/edit-pet/${pet.id}`} className="text-blue-400 hover:text-blue-600">
                    Düzenle
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-100">Kayıtlı evcil hayvanınız yok.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePets;