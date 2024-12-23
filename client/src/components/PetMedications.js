import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPetMedications } from '../api';

const PetMedications = () => {
  const { petId } = useParams();
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Bu bileşende sadece ilaç ve aşıları listeleyeceğiz
  // Yeni ilaç/aşı ekleme, düzenleme ve silme işlemleri için ayrı bileşenler ve rotalar oluşturabilirsiniz.

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">İlaç ve Aşı Takvimi</h2>
        {isLoading && <div className="mb-4 p-2 text-gray-100">Yükleniyor...</div>}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}

        {medications.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlaç/Aşı Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlangıç Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bitiş Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dozaj</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sıklık</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notlar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medications.map((medication) => (
                <tr key={medication.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{medication.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(medication.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(medication.endDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medication.dosage}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medication.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medication.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-100">Bu evcil hayvana ait ilaç veya aşı kaydı bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
};

export default PetMedications;