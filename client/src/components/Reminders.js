import React, { useState, useEffect } from 'react';
import { getReminders, createReminder, getPets } from '../api';
import dayjs from 'dayjs';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    petId: '',
    type: '',
    date: '',
    notes: '',
  });
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReminders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getReminders();
        setReminders(response.data);
      } catch (error) {
        setError('Hatırlatıcılar alınamadı.');
        console.error('Hatırlatıcılar alınamadı:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPets = async () => {
      try {
        const response = await getPets();
        setPets(response.data);
      } catch (error) {
        setError('Evcil hayvanlar alınamadı.');
        console.error('Evcil hayvanlar alınamadı:', error);
      }
    };

    fetchReminders();
    fetchPets();
  }, []);

  const handleNewReminderChange = (e) => {
    setNewReminder({ ...newReminder, [e.target.name]: e.target.value });
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await createReminder(newReminder);
      setReminders([...reminders, response.data]);
      setNewReminder({
        petId: '',
        type: '',
        date: '',
        notes: '',
      });
      setMessage('Hatırlatıcı başarıyla eklendi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message); // API'den gelen hata mesajını göster
      console.error('Hatırlatıcı eklenemedi:', error);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD.MM.YYYY');
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Hatırlatıcılar
        </h2>
        {isLoading && <div className="mb-4 p-2 text-gray-100">Yükleniyor...</div>}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
        {message && (
          <div className={`mb-4 p-2 ${message.startsWith("Hatırlatıcı başarıyla") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleAddReminder} className="mb-8 space-y-4">
          <h3 className="text-xl font-semibold text-white">
            Yeni Hatırlatıcı Ekle
          </h3>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4">
              <div>
                <label
                  htmlFor="newPetId"
                  className="block mb-2 text-white"
                >
                  Evcil Hayvan
                </label>
                <select
                  id="newPetId"
                  name="petId"
                  value={newReminder.petId}
                  onChange={handleNewReminderChange}
                  className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
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
                  htmlFor="newType"
                  className="block mb-2 text-white"
                >
                  Tür
                </label>
                <select
                  id="newType"
                  name="type"
                  value={newReminder.type}
                  onChange={handleNewReminderChange}
                  className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent
                  "
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="İlaç">İlaç</option>
                  <option value="Aşı">Aşı</option>
                  <option value="Randevu">Randevu</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="newDate"
              className="block mb-2 text-white"
            >
              Tarih
            </label>
            <input
              type="date"
              id="newDate"
              name="date"
              value={newReminder.date}
              onChange={handleNewReminderChange}
              className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent
              "
              required
            />
          </div>
          <div>
            <label
              htmlFor="newNotes"
              className="block mb-2 text-white"
            >
              Notlar
            </label>
            <textarea
              id="newNotes"
              name="notes"
              value={newReminder.notes}
              onChange={handleNewReminderChange}
              className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent
              "
              placeholder="Hatırlatıcı notları"
            />
          </div>
          <button
            type="submit"
            className="bg-link hover:bg-link-hover text-gray-900 px-4 py-2 rounded-md"
          >
            Hatırlatıcı Ekle
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.length > 0 ? (
            reminders.map((reminder) => {
              const pet = pets.find((p) => p.id === reminder.petId);
              return (
                <div
                  key={reminder.id}
                  className="p-4 border rounded-lg shadow-md bg-card-bg"
                >
                  <p className="font-semibold text-gray-100">
                    Evcil Hayvan: {pet ? pet.name : 'Bilinmiyor'}
                  </p>
                  <p className="text-gray-100">Tür: {reminder.type}</p>
                  <p className="text-gray-100">
                    Tarih: {formatDate(reminder.date)}
                  </p>
                  <p className="text-gray-100">Notlar: {reminder.notes}</p>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-100">
              <p>Henüz hatırlatıcı yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;