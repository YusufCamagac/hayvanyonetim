import React, { useState } from 'react';
import { getAppointmentReport, getPetReport, getUserReport } from '../api'; // getPetReport ve getUserReport eklendi
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const AdminReports = () => {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    provider: '',
    petType: '',
    species: '',
    gender: '',
    minAge: '',
    maxAge: '',
    role: ''
  });
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState('appointments');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleStartDateChange = (date) => {
    setFilters({ ...filters, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setFilters({ ...filters, endDate: date });
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    // Seçili rapor türü değiştiğinde, form verilerini ve sonuçları sıfırla
    setFilters({
      startDate: null,
      endDate: null,
      provider: '',
      petType: '',
      species: '',
      gender: '',
      minAge: '',
      maxAge: '',
      role: ''
    });
    setReportData([]);
  };

  // Randevu Raporu için submit fonksiyonu
  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
          const response = await getAppointmentReport(filters);
          setReportData(response.data);
      } catch (err) {
          console.error('Randevu raporu alınırken hata oluştu:', err);
          setError('Randevu raporu alınamadı.');
      } finally {
          setLoading(false);
      }
  };

  // Evcil Hayvan Raporu için submit fonksiyonu
  const handlePetReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await getPetReport(filters);
      setReportData(response.data);
    } catch (err) {
      console.error('Evcil hayvan raporu alınırken hata oluştu:', err);
      setError('Evcil hayvan raporu alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı Raporu için submit fonksiyonu
  const handleUserReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await getUserReport(filters);
      setReportData(response.data);
    } catch (err) {
      console.error('Kullanıcı raporu alınırken hata oluştu:', err);
      setError('Kullanıcı raporu alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Raporlar</h2>

        {/* Rapor Türü Seçimi */}
        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel id="report-type-label" className="text-gray-100">
              Rapor Türü
            </InputLabel>
            <Select
              labelId="report-type-label"
              id="reportType"
              name="reportType"
              value={reportType}
              onChange={handleReportTypeChange}
              label="Rapor Türü"
              className="text-gray-100"
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#28282B',
                    color: '#e2e8f0',
                  },
                },
              }}
            >
              <MenuItem value="appointments">Randevu Raporu</MenuItem>
              <MenuItem value="pets">Evcil Hayvan Raporu</MenuItem>
              <MenuItem value="users">Kullanıcı Raporu</MenuItem>
            </Select>
          </FormControl>
        </div>

        {isLoading && (
          <div className="mb-4 p-2 text-gray-100">Yükleniyor...</div>
        )}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}

        {/* Seçilen Rapor Türüne Göre Form */}
        {reportType === 'appointments' && (
          <>
            <h3 className="text-xl font-semibold text-gray-100">
              Randevu Raporu
            </h3>
            <form onSubmit={handleSubmit} className="mb-4">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Başlangıç Tarihi"
                    value={filters.startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          className: 'text-gray-100',
                          shrink: true,
                        }}
                        InputProps={{
                          className: 'text-gray-100',
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Bitiş Tarihi"
                    value={filters.endDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          className: 'text-gray-100',
                          shrink: true,
                        }}
                        InputProps={{
                          className: 'text-gray-100',
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Veteriner"
                    name="provider"
                    value={filters.provider}
                    onChange={handleFilterChange}
                    margin="normal"
                    InputLabelProps={{
                      className: 'text-gray-100',
                      shrink: true,
                    }}
                    InputProps={{
                      className: 'text-gray-100',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="pet-type-label" className="text-gray-100">
                      Evcil Hayvan Türü
                    </InputLabel>
                    <Select
                      labelId="pet-type-label"
                      id="petType"
                      name="petType"
                      value={filters.petType}
                      onChange={handleFilterChange}
                      label="Evcil Hayvan Türü"
                      className="text-gray-100"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: '#28282B',
                            color: '#e2e8f0',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Hepsi</MenuItem>
                      <MenuItem value="Köpek">Köpek</MenuItem>
                      <MenuItem value="Kedi">Kedi</MenuItem>
                      <MenuItem value="Kuş">Kuş</MenuItem>
                      <MenuItem value="Diğer">Diğer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: '#EAB508', color: '#0D0D0D' }}
                  >
                    Raporu Oluştur
                  </Button>
                </Grid>
              </Grid>
            </form>
          </>
        )}

        {reportType === 'pets' && (
          <>
            <h3 className="text-xl font-semibold text-gray-100">
              Evcil Hayvan Raporu
            </h3>
            <form onSubmit={handlePetReportSubmit} className="mb-4">
              {/* Evcil Hayvan Raporu için Filtreler */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tür"
                    name="species"
                    value={filters.species}
                    onChange={handleFilterChange}
                    margin="normal"
                    InputLabelProps={{
                      className: 'text-gray-100',
                      shrink: true,
                    }}
                    InputProps={{
                      className: 'text-gray-100',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cinsiyet"
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    margin="normal"
                    InputLabelProps={{
                      className: 'text-gray-100',
                      shrink: true,
                    }}
                    InputProps={{
                      className: 'text-gray-100',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Yaş"
                    name="minAge"
                    type="number"
                    value={filters.minAge}
                    onChange={handleFilterChange}
                    margin="normal"
                    InputLabelProps={{
                      className: 'text-gray-100',
                      shrink: true,
                    }}
                    InputProps={{
                      className: 'text-gray-100',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maksimum Yaş"
                    name="maxAge"
                    type="number"
                    value={filters.maxAge}
                    onChange={handleFilterChange}
                    margin="normal"
                    InputLabelProps={{
                      className: 'text-gray-100',
                      shrink: true,
                    }}
                    InputProps={{
                      className: 'text-gray-100',
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: '#EAB508', color: '#0D0D0D' }}
                  >
                    Raporu Oluştur
                  </Button>
                </Grid>
              </Grid>
            </form>
          </>
        )}

        {reportType === 'users' && (
          <>
            <h3 className="text-xl font-semibold text-gray-100">
              Kullanıcı Raporu
            </h3>
            <form onSubmit={handleUserReportSubmit} className="mb-4">
              {/* Kullanıcı Raporu için Filtreler */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Başlangıç Tarihi"
                    value={filters.startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          className: 'text-gray-100',
                          shrink: true,
                        }}
                        InputProps={{
                          className: 'text-gray-100',
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Bitiş Tarihi"
                    value={filters.endDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          className: 'text-gray-100',
                          shrink: true,
                        }}
                        InputProps={{
                          className: 'text-gray-100',
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="user-role-label" className="text-gray-100">
                      Rol
                    </InputLabel>
                    <Select
                      labelId="user-role-label"
                      id="role"
                      name="role"
                      value={filters.role}
                      onChange={handleFilterChange}
                      label="Rol"
                      className="text-gray-100"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: '#28282B',
                            color: '#e2e8f0',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Hepsi</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: '#EAB508', color: '#0D0D0D' }}
                  >
                    Raporu Oluştur
                  </Button>
                </Grid>
              </Grid>
            </form>
          </>
        )}

        {/* Rapor Sonuçları */}
        {!isLoading && reportData.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-100">
              {reportType === 'appointments'
                ? 'Randevu Raporu'
                : reportType === 'pets'
                ? 'Evcil Hayvan Raporu'
                : 'Kullanıcı Raporu'}
            </h3>
            {/* Tablo gösterimi */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {reportType === 'appointments' && (
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evcil Hayvan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tür
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Veteriner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sebep
                    </th>
                  </tr>
                )}
                {reportType === 'pets' && (
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tür
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cins
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yaş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cinsiyet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tıbbi Geçmiş
                    </th>
                  </tr>
                )}
                {reportType === 'users' && (
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-posta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                  </tr>
                )}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item) => (
                  <tr key={item.id}>
                    {reportType === 'appointments' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(item.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.petName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.petSpecies}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.provider}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.reason}
                        </td>
                      </>
                    )}
                    {reportType === 'pets' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.species}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.breed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.gender}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.medicalHistory}
                        </td>
                      </>
                    )}
                    {reportType === 'users' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.role}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;