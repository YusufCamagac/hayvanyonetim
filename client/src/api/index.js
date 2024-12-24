import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Her istekte, localStorage'dan token'ı alıp Authorization başlığına ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hata işleyici fonksiyon
const handleApiError = (error) => {
  if (error.response) {
    // İstek yapıldı ve sunucu 2xx dışında bir durum koduyla yanıt verdi
    console.error('API Hatası:', error.response.data);
    throw new Error(error.response.data.msg || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  } else if (error.request) {
    // İstek yapıldı ancak yanıt alınamadı
    console.error('API Hatası:', error.request);
    throw new Error('Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.');
  } else {
    // İsteği ayarlarken bir hata oluştu
    console.error('API Hatası:', error.message);
    throw new Error('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
};

// Evcil Hayvanlar
export const getPets = (ownerId = null) => {
  // Değişiklik burada: ownerId parametresi eklendi ve sorguya dahil ediliyor
  if (ownerId) {
    return api.get('/pets', { params: { ownerId: ownerId } }).catch(handleApiError);
  } else {
    return api.get('/pets').catch(handleApiError);
  }
};
export const getPetById = (id) => api.get(`/pets/${id}`).catch(handleApiError);
export const createPet = (petData) => api.post('/pets', petData).catch(handleApiError);
export const updatePet = (id, petData) => api.put(`/pets/${id}`, petData).catch(handleApiError);
export const deletePet = (id) => api.delete(`/pets/${id}`).catch(handleApiError);

// Randevular
export const getAppointments = () => api.get('/appointments').catch(handleApiError);
export const getAppointmentById = (id) => api.get(`/appointments/${id}`).catch(handleApiError);
export const createAppointment = (appointmentData) => api.post('/appointments', appointmentData).catch(handleApiError);
export const updateAppointment = (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData).catch(handleApiError);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`).catch(handleApiError);

// Tıbbi Kayıtlar
export const getMedicalRecords = () => api.get('/medical-records').catch(handleApiError);
export const getMedicalRecordById = (id) => api.get(`/medical-records/${id}`).catch(handleApiError);
export const updateMedicalRecord = (id, medicalRecordData) => api.put(`/medical-records/${id}`, medicalRecordData).catch(handleApiError);
export const deleteMedicalRecord = (id) => api.delete(`/medical-records/${id}`).catch(handleApiError);
export const createMedicalRecord = (medicalRecordData) => api.post('/medical-records', medicalRecordData).catch(handleApiError);

// Kullanıcılar
export const getUsers = () => api.get('/users').catch(handleApiError);
export const getUserById = (id) => api.get(`/users/${id}`).catch(handleApiError);
export const createUser = (userData) => api.post('/users', userData).catch(handleApiError);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData).catch(handleApiError);
export const deleteUser = (id) => api.delete(`/users/${id}`).catch(handleApiError);

// Hatırlatıcılar
export const getReminders = () => api.get('/reminders').catch(handleApiError);
export const createReminder = (reminderData) => api.post('/reminders', reminderData).catch(handleApiError);
export const updateReminder = (id, reminderData) => api.put(`/reminders/${id}`, reminderData).catch(handleApiError);
export const deleteReminder = (id) => api.delete(`/reminders/${id}`).catch(handleApiError);

// Evcil Hayvan İlaç ve Aşıları
export const getPetMedications = (petId) => api.get(`/pets/${petId}/medications`).catch(handleApiError);
export const createPetMedication = (petId, medicationData) => api.post(`/pets/${petId}/medications`, medicationData).catch(handleApiError);
export const updatePetMedication = (petId, medicationId, medicationData) => api.put(`/pets/${petId}/medications/${medicationId}`, medicationData).catch(handleApiError);
export const deletePetMedication = (petId, medicationId) => api.delete(`/pets/${petId}/medications/${medicationId}`).catch(handleApiError);

// Raporlar
export const getAppointmentReport = (filters) => api.get('/reports/appointments', { params: filters }).catch(handleApiError);
export const getPetReport = (filters) => api.get('/reports/pets', { params: filters }).catch(handleApiError);
export const getUserReport = (filters) => api.get('/reports/users', { params: filters }).catch(handleApiError);

// Kimlik Doğrulama
export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials)
    .then(response => {
      console.log("Login response:", response); // Tüm yanıtı konsola yazdır
      return response.data;
    })
    .catch(handleApiError);
};
export const registerUser = (userData) => api.post('/auth/register', userData).then(response => response.data).catch(handleApiError);

export default api;