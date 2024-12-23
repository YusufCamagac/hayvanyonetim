import React, { useState, useEffect } from "react";
import { createAppointment, getPets } from "../api";
import { TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const AppointmentScheduling = () => {
  const [appointment, setAppointment] = useState({
    petId: "",
    date: dayjs(),
    time: "",
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
    if (e.target.name === "time") {
      const [hours, minutes] = e.target.value.split(":");
      const newTime = dayjs()
        .set("hour", hours)
        .set("minute", minutes)
        .set("second", 0);
      setAppointment({ ...appointment, date: newTime });
    } else {
      setAppointment({ ...appointment, [e.target.name]: e.target.value });
    }
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
        time: "",
        provider: "",
        reason: "",
      });

      setTimeout(() => setMessage(""), 3000);

      console.log(response.data);
    } catch (error) {
      setMessage("Randevu oluşturulamadı.");
      console.error(error);
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Randevu Alma
        </h2>
        {message && (
          <div className="mb-4 p-2 bg-red-100 text-red-700">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="petId" className="block mb-2 text-gray-100">
              Evcil Hayvan
            </label>
            <select
              id="petId"
              name="petId"
              value={appointment.petId}
              onChange={handleChange}
              className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400
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
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div>
                <label htmlFor="date" className="block mb-2 text-gray-100">
                  Tarih ve Saat
                </label>
                <DateTimePicker
                  name="date"
                  value={appointment.date}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      InputProps={{
                        className: "bg-gray-700 text-gray-100",
                        style: { color: "white" },
                      }}
                    />
                  )}
                  className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                      name: "date",
                      InputLabelProps: {
                        className: "text-gray-100",
                      },
                      InputProps: {
                        className: "text-gray-100",
                      },
                      inputProps: {
                        className:
                          "bg-gray-700 text-gray-100 placeholder-gray-400",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="provider" className="block mb-2 text-gray-100">
              Sağlayıcı
            </label>
            <input
              type="text"
              id="provider"
              name="provider"
              value={appointment.provider}
              onChange={handleChange}
              className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 "
              required
              placeholder="Veteriner adı"
            />
          </div>
          <div>
            <label htmlFor="reason" className="block mb-2 text-gray-100">
              Randevu Nedeni
            </label>
            <textarea
              id="reason"
              name="reason"
              value={appointment.reason}
              onChange={handleChange}
              className=" w-full px-3 py-2 border rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Randevu nedeninizi kısaca açıklayınız"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md"
          >
            Randevu Oluştur
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentScheduling;