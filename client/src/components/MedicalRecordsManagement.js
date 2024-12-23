import React, { useState, useEffect } from 'react';
import {
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
  getPets,
} from '../api';

const MedicalRecordsManagement = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    recordDate: '',
    description: '',
  });
  const [message, setMessage] = useState('');
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await getPets();
        setPets(response.data);
      } catch (error) {
        console.error('Evcil hayvanlar alınamadı:', error);
        setError('Evcil hayvanlar alınamadı.');
      }
    };
    fetchPets();
    fetchMedicalRecords();
  }, []);

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

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setFormData({
      petId: record.petId,
      recordDate: record.recordDate,
      description: record.description,
    });
    setEditMode(true);
    setMessage('');
    setError(null);
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Tıbbi kaydı silmek istediğinize emin misiniz?')) {
      setIsLoading(true);
      setError(null);
      try {
        await deleteMedicalRecord(recordId);
        setMedicalRecords(
          medicalRecords.filter((record) => record.id !== recordId)
        );
        setSelectedRecord(null);
        setEditMode(false);
        setMessage('Tıbbi kayıt başarıyla silindi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Tıbbi kayıt silinemedi:', error);
        setError('Tıbbi kayıt silinemedi.');
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
        const response = await updateMedicalRecord(
          selectedRecord.id,
          formData
        );
        setMedicalRecords(
          medicalRecords.map((record) =>
            record.id === selectedRecord.id ? response.data : record
          )
        );
        setSelectedRecord(null);
        setEditMode(false);
        setMessage('Tıbbi kayıt başarıyla güncellendi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Tıbbi kayıt güncellenemedi:', error);
        setError('Tıbbi kayıt güncellenemedi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedRecord(null);
    setFormData({
      petId: '',
      recordDate: '',
      description: '',
    });
    setMessage('');
    setError(null);
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Tıbbi Kayıtları Yönet
        </h2>

        {isLoading && (
          <div className="mb-4 p-2 text-gray-100">Yükleniyor...</div>
        )}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700">{message}</div>
        )}

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
                  Kayıt Tarihi: {new Date(record.recordDate).toLocaleDateString()}
                </p>
                <p className="text-gray-100">
                  Açıklama: {record.description}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Sil
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {editMode && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-100">
              Tıbbi Kaydı Düzenle
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="petId"
                      className="block mb-2 text-gray-100"
                    >
                      Evcil Hayvan
                    </label>
                    <select
                      id="petId"
                      name="petId"
                      value={formData.petId}
                      onChange={handleChange}
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
                      htmlFor="recordDate"
                      className="block mb-2 text-gray-100"
                    >
                      Kayıt Tarihi
                    </label>
                    <input
                      type="date"
                      id="recordDate"
                      name="recordDate"
                      value={formData.recordDate}
                      onChange={handleChange}
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
                  htmlFor="description"
                  className="block mb-2 text-gray-100"
                >
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
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
                  placeholder="Tıbbi kayıt detayları"
                />
              </div>
              <div className="flex items-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
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

export default MedicalRecordsManagement;