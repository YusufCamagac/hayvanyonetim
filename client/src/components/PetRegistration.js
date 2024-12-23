import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getPetMedications,
  createPetMedication,
  updatePetMedication,
  deletePetMedication,
} from '../api'; // api/index.js'e bu fonksiyonları ekleyeceğiz

const PetMedications = () => {
  const { petId } = useParams();
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Düzenleme için gerekli state'ler
  const [editMode, setEditMode] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    dosage: '',
    frequency: '',
    notes: '',
  });

  useEffect(() => {
    const fetchMedications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPetMedications(petId);
        setMedications(response.data);
      } catch (error) {
        console.error('İlaç ve aşı bilgileri alınamadı:', error);
        setError('İlaç ve aşı bilgileri alınamadı.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [petId]);

  // Yeni Kayıt Formu için handleChange Fonksiyonu
  const handleNewMedicationChange = (e) => {
    setNewMedication({
      ...newMedication,
      [e.target.name]: e.target.value,
    });
  };

  // Yeni Kayıt Ekleme Fonksiyonu
  const handleAddMedication = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await createPetMedication(petId, newMedication);
      setMedications([...medications, response.data]);
      setNewMedication({
        // Formu sıfırla
        name: '',
        startDate: '',
        endDate: '',
        dosage: '',
        frequency: '',
        notes: '',
      });
      setMessage('Kayıt başarıyla eklendi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Kayıt eklenemedi:', error);
      setError('Kayıt eklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Düzenleme Moduna Geçiş Fonksiyonu
  const handleEdit = (medication) => {
    setSelectedMedication(medication);
    setFormData({
      name: medication.name,
      startDate: medication.startDate,
      endDate: medication.endDate,
      dosage: medication.dosage,
      frequency: medication.frequency,
      notes: medication.notes,
    });
    setEditMode(true);
    setMessage('');
    setError(null);
  };

  // Düzenleme İptali Fonksiyonu
  const handleCancel = () => {
    setEditMode(false);
    setSelectedMedication(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      dosage: '',
      frequency: '',
      notes: '',
    });
    setMessage('');
    setError(null);
  };

  // Form değişikliği için handleChange Fonksiyonu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Gönderme Fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (editMode) {
      try {
        const response = await updatePetMedication(
          selectedMedication.id,
          formData
        );
        setMedications(
          medications.map((medication) =>
            medication.id === selectedMedication.id ? response.data : medication
          )
        );
        setSelectedMedication(null);
        setEditMode(false);
        setMessage('Kayıt başarıyla güncellendi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Kayıt güncellenemedi:', error);
        setError('Kayıt güncellenemedi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Kayıt Silme Fonksiyonu
  const handleDelete = async (medicationId) => {
    if (window.confirm('Kaydı silmek istediğinize emin misiniz?')) {
      setIsLoading(true);
      setError(null);
      try {
        await deletePetMedication(medicationId);
        setMedications(
          medications.filter((medication) => medication.id !== medicationId)
        );
        setSelectedMedication(null);
        setEditMode(false);
        setMessage('Kayıt başarıyla silindi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Kayıt silinemedi:', error);
        setError('Kayıt silinemedi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          {/* İlgili evcil hayvanın adı */}
          Evcil Hayvan İlaç ve Aşı Takvimi
        </h2>
        {isLoading && <div className="mb-4 p-2 text-gray-100">Yükleniyor...</div>}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700">{message}</div>
        )}

        {/* Yeni Kayıt Ekleme Formu */}
        <form onSubmit={handleAddMedicalRecord} className="mb-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-100">
            Yeni Kayıt Ekle
          </h3>
          <div className="flex flex-wrap -mx-4">
            {/* Form inputları buraya gelecek */}
          </div>
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md"
          >
            Kayıt Ekle
          </button>
        </form>

        {/* Kayıtları Listeleme */}
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
                {/* Düzenleme ve Silme butonları */}
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

        {/* Düzenleme Modu */}
        {editMode && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-100">
              Kaydı Düzenle
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Düzenleme formu inputları */}
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

export default PetMedications;