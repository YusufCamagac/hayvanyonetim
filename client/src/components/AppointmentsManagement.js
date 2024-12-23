import React, { useState, useEffect } from 'react';
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
  getPets,
} from '../api';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    date: dayjs(),
    provider: '',
    reason: '',
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
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Randevular alınamadı:', error);
      setError('Randevular alınamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      petId: appointment.petId,
      date: dayjs(appointment.date),
      provider: appointment.provider,
      reason: appointment.reason,
    });
    setEditMode(true);
    setMessage('');
    setError(null);
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Randevuyu silmek istediğinize emin misiniz?')) {
      setIsLoading(true);
      setError(null);
      try {
        await deleteAppointment(appointmentId);
        setAppointments(
          appointments.filter(
            (appointment) => appointment.id !== appointmentId
          )
        );
        setSelectedAppointment(null);
        setEditMode(false);
        setMessage('Randevu başarıyla silindi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Randevu silinemedi:', error);
        setError('Randevu silinemedi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      setIsLoading(true);
      setError(null);
      try {
        const updatedAppointmentData = {
          ...formData,
          date: formData.date.toISOString(),
        };

        const response = await updateAppointment(
          selectedAppointment.id,
          updatedAppointmentData
        );
        setAppointments(
          appointments.map((appointment) =>
            appointment.id === selectedAppointment.id ? response.data : appointment
          )
        );
        setSelectedAppointment(null);
        setEditMode(false);
        setMessage('Randevu başarıyla güncellendi.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Randevu güncellenemedi:', error);
        setError('Randevu güncellenemedi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedAppointment(null);
    setFormData({
      petId: '',
      date: dayjs(),
      provider: '',
      reason: '',
    });
    setMessage('');
    setError(null);
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Randevuları Yönet
        </h2>

        {isLoading && (
          <div className="mb-4 p-2 text-gray-100">Yükleniyor...</div>
        )}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700">{message}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => {
            const pet = pets.find((p) => p.id === appointment.petId);
            return (
              <div
                key={appointment.id}
                className="p-4 border rounded-lg shadow-md bg-card-bg"
              >
                <p className="font-semibold text-gray-100">
                  Evcil Hayvan: {pet ? pet.name : 'Bilinmiyor'}
                </p>
                <p className="text-gray-100">
                  Tarih: {dayjs(appointment.date).format('DD.MM.YYYY HH:mm')}
                </p>
                <p className="text-gray-100">
                  Sağlayıcı: {appointment.provider}
                </p>
                <p className="text-gray-100">Sebep: {appointment.reason}</p>
                <div className="mt-2">
                  <button
                    onClick={() => handleEdit(appointment)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(appointment.id)}
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
              Randevu Düzenle
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
                      className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                      htmlFor="provider"
                      className="block mb-2 text-gray-100"
                    >
                      Sağlayıcı
                    </label>
                    <input
                      type="text"
                      id="provider"
                      name="provider"
                      value={formData.provider}
                      onChange={handleChange}
                      className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                      placeholder="Veteriner adı"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-4">
                <div className="w-full px-4">
                  <div>
                    <label
                      htmlFor="date"
                      className="block mb-2 text-gray-100"
                    >
                      Tarih ve Saat
                    </label>
                    <DateTimePicker
                      name="date"
                      value={formData.date}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          InputProps={{
                            className: 'bg-gray-700 text-gray-100',
                            style: { color: 'white' },
                          }}
                        />
                      )}
                      className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400
                      "
                      required
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          fullWidth: true,
                          margin: 'normal',
                          required: true,
                          name: 'date',
                          InputLabelProps: {
                            className: 'text-gray-100',
                          },
                          InputProps: {
                            className: 'text-gray-100',
                          },
                          inputProps: {
                            className:
                              'bg-gray-700 text-gray-100 placeholder-gray-400',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="reason"
                  className="block mb-2 text-gray-100"
                >
                  Randevu Nedeni
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-yellow-400
                  "
                  placeholder="Randevu nedeninizi kısaca açıklayınız"
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

export default AppointmentsManagement;