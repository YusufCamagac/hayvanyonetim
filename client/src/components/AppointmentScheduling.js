import React, { useState, useEffect } from "react";
import { createAppointment, getPets } from "../api";
import { TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const AppointmentScheduling = () => {
  const [appointment, setAppointment] = useState({
    petId: "",
    date: dayjs(),
    provider: "",
    reason: "",
  });
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await getPets();
        setPets(response.data);
      } catch (error) {
        console.error("Evcil hayvanlar alınamadı:", error);
      }
    };
    fetchPets();
  }, []);

  const handleDateChange = (newDate) => {
    setAppointment({ ...appointment, date: newDate });
  };

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        ...appointment,
        date: appointment.date.toISOString(),
      };

      const response = await createAppointment(appointmentData);
      setMessage("Randevu başarıyla oluşturuldu!");
      setAppointment({
        petId: "",
        date: dayjs(),
        provider: "",
        reason: "",
      });

      setTimeout(() => setMessage(""), 5000);
      console.log(response.data);
    } catch (error) {
      setMessage(error.message);
      console.error(error);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Randevu Alma
        </h2>
        {message && (
          <div className={`mb-4 p-2 ${message.startsWith("Randevu başarıyla") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormControl fullWidth>
            <InputLabel id="pet-select-label" sx={{ color: 'white' }}>Evcil Hayvan</InputLabel>
            <Select
              labelId="pet-select-label"
              id="petId"
              name="petId"
              value={appointment.petId}
              onChange={handleChange}
              label="Evcil Hayvan"
              sx={{
                backgroundColor: '#28282B',
                color: 'white',
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
                '& .MuiSelect-select': {
                  color: '#e2e8f0',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': { // Hover durumunda da border rengi beyaz
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { // Focus durumunda da border rengi beyaz
                  borderColor: 'white',
                },
              }}
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
          <DateTimePicker
            label="Tarih ve Saat"
            name="date"
            value={appointment.date}
            onChange={handleDateChange}
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                backgroundColor: '#28282B',
                color: 'white',
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': { // Hover durumunda da border rengi beyaz
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { // Focus durumunda da border rengi beyaz
                  borderColor: 'white',
                },
              },
              "& .MuiInputLabel-root": {
                color: 'white',
                "&.Mui-focused": {
                  color: 'white'
                }
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white"
                },
                "&:hover fieldset": {
                  borderColor: "white"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white"
                }
              }
            }}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                InputLabelProps: {
                  style: { color: 'white' },
                  shrink: true,
                },
                InputProps: {
                  style: { color: 'white' },
                  placeholder: 'GG.AA.YYYY SS:DD',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Sağlayıcı"
            name="provider"
            value={appointment.provider}
            onChange={handleChange}
            InputLabelProps={{
              style: { color: 'white' },
              shrink: true,
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: '#28282B',
                '&:hover .MuiOutlinedInput-notchedOutline': { // Hover durumunda da border rengi beyaz
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { // Focus durumunda da border rengi beyaz
                  borderColor: 'white',
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: 'white',
              },
            }}
          />
          <TextField
            fullWidth
            label="Randevu Nedeni"
            name="reason"
            value={appointment.reason}
            onChange={handleChange}
            multiline
            rows={4}
            InputLabelProps={{
              style: { color: 'white' },
              shrink: true,
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: '#28282B',
                '&:hover .MuiOutlinedInput-notchedOutline': { // Hover durumunda da border rengi beyaz
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { // Focus durumunda da border rengi beyaz
                  borderColor: 'white',
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: 'white',
              },
            }}
          />
          <button
            type="submit"
            className="bg-link hover:bg-link-hover text-gray-900 px-4 py-2 rounded-md"
          >
            Randevu Oluştur
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentScheduling;