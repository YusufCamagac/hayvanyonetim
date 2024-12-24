import React, { useState } from 'react';
import { getAppointmentReport, getPetReport, getUserReport } from '../api';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  TextField
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
    minAge: null,
    maxAge: null,
    role: ''
  });
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState('appointments');
  const [isLoading, setIsLoading] = useState(false); // isLoading tanımlandı
  const [error, setError] = useState(null);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDateChange = (name, date) => {
    setFilters({ ...filters, [name]: date });
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    setFilters({
      startDate: null,
      endDate: null,
      provider: '',
      petType: '',
      species: '',
      gender: '',
      minAge: null,
      maxAge: null,
      role: ''
    });
    setReportData([]);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // setLoading yerine setIsLoading kullanıldı
    setError(null);
    try {
      let response;
      if (reportType === 'appointments') {
        response = await getAppointmentReport(filters);
      } else if (reportType === 'pets') {
        response = await getPetReport(filters);
      } else if (reportType === 'users') {
        response = await getUserReport(filters);
      }
      setReportData(response.data);
    } catch (err) {
      console.error(`${reportType} raporu alınırken hata oluştu:`, err);
      setError(`${reportType} raporu alınamadı.`);
    } finally {
      setIsLoading(false); // setLoading yerine setIsLoading kullanıldı
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD.MM.YYYY');
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-headings">Raporlar</h2>

        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel id="report-type-label" className="text-gray-100">
              Rapor Türü
            </InputLabel>
            <Select
              labelId="report-type-label"
              id="report-type-select"
              value={reportType}
              label="Rapor Türü"
              onChange={handleReportTypeChange}
              className="text-gray-100"
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {reportType === 'appointments' && (
              <>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Başlangıç Tarihi"
                    value={filters.startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                    format="DD.MM.YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Bitiş Tarihi"
                    value={filters.endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    format="DD.MM.YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Veteriner"
                    name="provider"
                    value={filters.provider}
                    onChange={handleFilterChange}
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
                  <FormControl fullWidth>
                    <InputLabel id="pet-type-label" className="text-gray-100">
                      Evcil Hayvan Türü
                    </InputLabel>
                    <Select
                      labelId="pet-type-label"
                      id="pet-type-select"
                      name="petType"
                      value={filters.petType}
                      onChange={handleFilterChange}
                      label="Evcil Hayvan Türü"
                      className="text-gray-100"
                    >
                      <MenuItem value="">Hepsi</MenuItem>
                      <MenuItem value="Köpek">Köpek</MenuItem>
                      <MenuItem value="Kedi">Kedi</MenuItem>
                      <MenuItem value="Kuş">Kuş</MenuItem>
                      <MenuItem value="Diğer">Diğer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {reportType === 'pets' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tür"
                    name="species"
                    value={filters.species}
                    onChange={handleFilterChange}
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
                    value={filters.minAge || ''}
                    onChange={handleFilterChange}
                    InputLabelProps={{
                      className: 'text-gray-100',
                      shrink: true,
                    }}
                    InputProps={{
                      className: 'text-gray-100',
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maksimum Yaş"
                    name="maxAge"
                    type="number"
                    value={filters.maxAge || ''}
                    onChange={handleFilterChange}
                    InputLabelProps={{
                      className: 'text-gray-100',
                      shrink: true,
                    }}
                    InputProps={{
                      className: 'text-gray-100',
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
              </>
            )}

            {reportType === 'users' && (
              <>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Başlangıç Tarihi"
                    value={filters.startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                    format="DD.MM.YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Bitiş Tarihi"
                    value={filters.endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    format="DD.MM.YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="user-role-label" className="text-gray-100">
                      Rol
                    </InputLabel>
                    <Select
                      labelId="user-role-label"
                      id="user-role-select"
                      name="role"
                      value={filters.role}
                      onChange={handleFilterChange}
                      label="Rol"
                      className="text-gray-100"
                    >
                      <MenuItem value="">Hepsi</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {reportType === 'appointments' && (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evcil Hayvan
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tür
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Veteriner
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sebep
                      </th>
                    </>
                  )}
                  {reportType === 'pets' && (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ad
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tür
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cins
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Yaş
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cinsiyet
                      </th>
                    </>
                  )}
                  {reportType === 'users' && (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kullanıcı Adı
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-posta
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kayıt Tarihi
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item, index) => (
                  <tr key={index}>
                    {reportType === 'appointments' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(item.date)}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Rapor Sonuçları Boşsa */}
        {!isLoading && reportData.length === 0 && (
          <div className="mt-4 text-gray-100">
            <p>
              {reportType === 'appointments'
                ? 'Seçili kriterlere göre randevu bulunamadı.'
                : reportType === 'pets'
                  ? 'Seçili kriterlere göre evcil hayvan bulunamadı.'
                  : 'Seçili kriterlere göre kullanıcı bulunamadı.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;