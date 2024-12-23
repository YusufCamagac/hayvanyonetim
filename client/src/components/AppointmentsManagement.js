import React, { useState, useEffect } from 'react';
import { getAppointments, updateAppointment, deleteAppointment, getPets } from '../api';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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

  const formatDate = (date) => {
    return dayjs(date).format('DD.MM.YYYY HH:mm');
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-headings">
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
                  Tarih: {formatDate(appointment.date)}
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
              <FormControl fullWidth>
                <InputLabel id="pet-select-label" className="text-gray-100">Evcil Hayvan</InputLabel>
                <Select
                  labelId="pet-select-label"
                  id="petId"
                  name="petId"
                  value={formData.petId}
                  onChange={handleChange}
                  label="Evcil Hayvan"
                  className="text-gray-100"
                >
                  <MenuItem value="">
                    <em>Seçiniz</em>
                  </MenuItem>
                  {pets.map((pet) => (
                    <MenuItem key={pet.id} value={pet.id}>
                      {pet.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Sağlayıcı"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                InputLabelProps={{
                  className: 'text-gray-100',
                  shrink: true,
                }}
                InputProps={{
                  className: 'text-gray-100',
                }}
              />
              <DateTimePicker
                label="Tarih ve Saat"
                name="date"
                value={formData.date}
                onChange={handleDateChange}
                className="text-gray-100"
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    InputLabelProps: {
                      className: 'text-gray-100',
                      shrink: true,
                    },
                    InputProps: {
                      className: 'text-gray-100',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Randevu Nedeni"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={4}
                InputLabelProps={{
                  className: 'text-gray-100',
                  shrink: true,
                }}
                InputProps={{
                  className: 'text-gray-100',
                }}
              />
              <div className="flex items-center">
                <button
                  type="submit"
                  className="bg-accent hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md mr-2"
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