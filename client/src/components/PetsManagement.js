import React, { useState, useEffect } from 'react';
import { getPets, updatePet, deletePet } from '../api';

const PetsManagement = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    medicalHistory: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPets();
      setPets(response.data);
    } catch (error) {
      console.error('Evcil hayvanlar alınamadı:', error);
      setError('Evcil hayvanlar alınamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      medicalHistory: pet.medicalHistory,
    });
    setEditMode(true);
    setMessage('');
    setError(null);
  };

  const handleDelete = async (petId) => {
    if (window.confirm('Evcil hayvanı silmek istediğinize emin misiniz?')) {
      setIsLoading(true);
      setError(null);
      try {
        await deletePet(petId);
        setPets(pets.filter((pet) => pet.id !== petId));
        setSelectedPet(null);
        setEditMode(false);
        setMessage('Evcil hayvan başarıyla silindi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Evcil hayvan silinemedi:', error);
        setError('Evcil hayvan silinemedi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (editMode) {
      try {
        const response = await updatePet(selectedPet.id, formData);
        setPets(
          pets.map((pet) => (pet.id === selectedPet.id ? response.data : pet))
        );
        setSelectedPet(null);
        setEditMode(false);
        setMessage('Evcil hayvan başarıyla güncellendi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Evcil hayvan güncellenemedi:', error);
        setError('Evcil hayvan güncellenemedi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedPet(null);
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      gender: '',
      medicalHistory: '',
    });
    setMessage('');
    setError(null);
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Evcil Hayvanları Yönet
        </h2>

        {isLoading && <div className="mb-4 p-2 text-gray-100">Yükleniyor...</div>}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700">{message}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="p-4 border rounded-lg shadow-md bg-card-bg"
            >
              <p className="font-semibold text-gray-100">
                İsim: {pet.name}
              </p>
              <p className="text-gray-100">Tür: {pet.species}</p>
              <p className="text-gray-100">Cins: {pet.breed}</p>
              <p className="text-gray-100">Yaş: {pet.age}</p>
              <p className="text-gray-100">Cinsiyet: {pet.gender}</p>
              <p className="text-gray-100">
                Tıbbi Geçmiş: {pet.medicalHistory}
              </p>
              <div className="mt-2">
                <button
                  onClick={() => handleEdit(pet)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(pet.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {editMode && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-100">
              Evcil Hayvan Düzenle
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-gray-100"
                    >
                      İsim
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                      placeholder="Evcil hayvanın adı"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="species"
                      className="block mb-2 text-gray-100"
                    >
                      Tür
                    </label>
                    <input
                      type="text"
                      id="species"
                      name="species"
                      value={formData.species}
                      onChange={handleChange}
                      className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                      placeholder="Örn: Kedi, Köpek"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="breed"
                      className="block mb-2 text-gray-100"
                    >
                      Cins
                    </label>
                    <input
                      type="text"
                      id="breed"
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Örn: Siyam, Golden Retriever"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="age"
                      className="block mb-2 text-gray-100"
                    >
                      Yaş
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className=" w-full px-3 py-2  border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                      min="0"
                      max="30"
                      placeholder="Yaş"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="gender"
                      className="block mb-2 text-gray-100"
                    >
                      Cinsiyet
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    >
                      <option value="">Seçiniz</option>
                      <option value="Erkek">Erkek</option>
                      <option value="Dişi">Dişi</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="medicalHistory"
                  className="block mb-2 text-gray-100"
                >
                  Tıbbi Geçmiş
                </label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="
                    w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Evcil hayvanın tıbbi geçmişi"
                />
              </div>
              <div className="flex items-center">
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md mr-2"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsManagement;