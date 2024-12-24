import React, { useState } from 'react';
import { createPet } from '../api';
import kopekMuayene from '../assents/resim3.jpg';

const PetRegistration = () => {
  const [pet, setPet] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    medicalHistory: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null); // Kaldırıldı

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // setError(null); // Kaldırıldı
    try {
      const response = await createPet(pet);
      setMessage('Evcil hayvan başarıyla kaydedildi!');
      setPet({
        name: '',
        species: '',
        breed: '',
        age: '',
        gender: '',
        medicalHistory: '',
      });
      setTimeout(() => setMessage(''), 3000);
      console.log(response.data);
    } catch (error) {
      setMessage(error.message); // API'den gelen hata mesajı gösterilecek
      console.error(error);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4">
            <img
              src={kopekMuayene}
              alt="Veteriner kliniğinde bir veteriner, köpeği muayene ediyor."
              className="w-full rounded-lg shadow-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-4 text-headings">
              Evcil Hayvan Kaydı
            </h2>
            <p className="text-gray-100 mb-4">
              Evcil hayvanınızın bilgilerini aşağıya girerek onu kaydedin ve
              sağlık takibini kolaylaştırın.
            </p>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            {message && (
              <div className={`mb-4 p-2 ${message.startsWith("Evcil hayvan başarıyla") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-gray-100"
                    >
                      Ad
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={pet.name}
                      onChange={handleChange}
                      className="
                        w-full
                        px-3
                        py-2
                        border
                        rounded-md
                        bg-gray-700
                        text-gray-100
                        placeholder-gray-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-accent
                      "
                      required
                      placeholder="Evcil hayvanınızın adı"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="species"
                      className="block mb-2 text-gray-100"
                    >
                      Tür
                    </label>
                    <input
                      type="text"
                      id="species"
                      name="species"
                      value={pet.species}
                      onChange={handleChange}
                      className="
                        w-full
                        px-3
                        py-2
                        border
                        rounded-md
                        bg-gray-700
                        text-gray-100
                        placeholder-gray-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-accent
                      "
                      required
                      placeholder="Örn: Kedi, Köpek"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="breed"
                      className="block mb-2 text-gray-100"
                    >
                      Irk
                    </label>
                    <input
                      type="text"
                      id="breed"
                      name="breed"
                      value={pet.breed}
                      onChange={handleChange}
                      className="
                        w-full
                        px-3
                        py-2
                        border
                        rounded-md
                        bg-gray-700
                        text-gray-100
                        placeholder-gray-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-accent
                      "
                      placeholder="Örn: Siyam, Golden Retriever"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="age"
                      className="block mb-2 text-gray-100"
                    >
                      Yaş
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={pet.age}
                      onChange={handleChange}
                      className="
                        w-full
                        px-3
                        py-2
                        border
                        rounded-md
                        bg-gray-700
                        text-gray-100
                        placeholder-gray-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-accent
                      "
                      required
                      min="0"
                      max="30"
                      placeholder="Yaş"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4">
                  <div>
                    <label
                      htmlFor="gender"
                      className="block mb-2 text-gray-100"
                    >
                      Cinsiyet
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={pet.gender}
                      onChange={handleChange}
                      className="
                        w-full
                        px-3
                        py-2
                        border
                        rounded-md
                        bg-gray-700
                        text-gray-100
                        focus:outline-none
                        focus:ring-2
                        focus:ring-accent
                      "
                      required
                    >
                      <option value="">Seçiniz</option>
                      <option value="Erkek">Erkek</option>
                      <option value="Dişi">Dişi</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="medicalHistory"
                  className="block mb-2 text-gray-100"
                >
                  Tıbbi Geçmiş
                </label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={pet.medicalHistory}
                  onChange={handleChange}
                  className="
                    w-full
                    px-3
                    py-2
                    border
                    rounded-md
                    bg-gray-700
                    text-gray-100
                    placeholder-gray-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-accent
                  "
                  placeholder="Evcil hayvanınızın tıbbi geçmişi"
                />
              </div>
              <button
                type="submit"
                className="bg-accent hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md"
              >
                Kaydet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetRegistration;