import React, { useState, useEffect } from 'react';
import { getMedicalRecords, createMedicalRecord, getPets } from '../api';

const MedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [newMedicalRecord, setNewMedicalRecord] = useState({
    petId: '',
    recordDate: '',
    description: '',
  });
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMedicalRecords();
        setMedicalRecords(response.data);
      } catch (error) {
        console.error('Tıbbi kayıtlar alınamadı:', error);
        setError('Tıbbi kayıtlar alınamadı.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPets = async () => {
      try {
        const response = await getPets();
        setPets(response.data);
      } catch (error) {
        console.error('Evcil hayvanlar alınamadı:', error);
        setError('Evcil hayvanlar alınamadı.');
      }
    };

    fetchMedicalRecords();
    fetchPets();
  }, []);

  const handleNewRecordChange = (e) => {
    setNewMedicalRecord({
      ...newMedicalRecord,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMedicalRecord = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await createMedicalRecord(newMedicalRecord);
      setMedicalRecords([...medicalRecords, response.data]);
      setNewMedicalRecord({
        petId: '',
        recordDate: '',
        description: '',
      });

      setMessage('Tıbbi kayıt başarıyla eklendi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Tıbbi kayıt eklenemedi:', error);
      setError('Tıbbi kayıt eklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Tıbbi Kayıtlar
        </h2>

        {isLoading && <div className="mb-4 p-2 text-gray-100">Yükleniyor...</div>}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700">{message}</div>
        )}

        <form onSubmit={handleAddMedicalRecord} className="mb-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-100">
            Yeni Kayıt Ekle
          </h3>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4">
              <div>
                <label
                  htmlFor="newPetId"
                  className="block mb-2 text-gray-100"
                >
                  Evcil Hayvan
                </label>
                <select
                  id="newPetId"
                  name="petId"
                  value={newMedicalRecord.petId}
                  onChange={handleNewRecordChange}
                  className="
                    w-full
                    px-3
                    py-2
                    border
                    rounded-md
                    bg-gray-700
                    text-gray-100
                    focus:outline-none
                    focus:ring-2
                    focus:ring-yellow-400
                  "
                  required
                >
                  <option value="">Seçiniz</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <div>
                <label
                  htmlFor="newRecordDate"
                  className="block mb-2 text-gray-100"
                >
                  Tarih
                </label>
                <input
                  type="date"
                  id="newRecordDate"
                  name="recordDate"
                  value={newMedicalRecord.recordDate}
                  onChange={handleNewRecordChange}
                  className="
                    w-full
                    px-3
                    py-2
                    border
                    rounded-md
                    bg-gray-700
                    text-gray-100
                    placeholder-gray-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-yellow-400
                  "
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="newDescription"
              className="block mb-2 text-gray-100"
            >
              Açıklama
            </label>
            <textarea
              id="newDescription"
              name="description"
              value={newMedicalRecord.description}
              onChange={handleNewRecordChange}
              className="
                w-full
                px-3
                py-2
                border
                rounded-md
                bg-gray-700
                text-gray-100
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
              required
              placeholder="Tıbbi kaydın detayları"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md"
          >
            Kayıt Ekle
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicalRecords.map((record) => {
            const pet = pets.find((p) => p.id === record.petId);
            return (
              <div
                key={record.id}
                className="p-4 border rounded-lg shadow-md bg-card-bg"
              >
                <p className="font-semibold text-gray-100">
                  Evcil Hayvan: {pet ? pet.name : 'Bilinmiyor'}
                </p>
                <p className="text-gray-100">
                  Tarih: {new Date(record.recordDate).toLocaleDateString()}
                </p>
                <p className="text-gray-100">
                  Açıklama: {record.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;