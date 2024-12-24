require('dotenv').config(); // .env dosyasını yükle (sadece server klasöründe .env dosyası var)
const express = require('express');
const cors = require('cors');
const sql = require('mssql'); // mssql paketini import et
const config = require('./config/database'); // database.js dosyasını import et

// Rotalar (routes)
const petRoutes = require('./routes/pets');
const appointmentRoutes = require('./routes/appointments');
const medicalRecordRoutes = require('./routes/medicalRecords');
const userRoutes = require('./routes/users');
const reminderRoutes = require('./routes/reminders');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
const authenticateToken = require('./middleware/authMiddleware');

// Veritabanına Bağlan
async function connectToDatabase() {
  try {
    await sql.connect(config); // database.js dosyasındaki config'i kullanarak bağlan
    console.log('Veritabanına bağlandı...');
  } catch (err) {
    console.error('Veritabanına bağlanılamadı:', err);
    process.exit(1); // Uygulamayı durdur, çünkü veritabanı bağlantısı olmadan çalışamaz
  }
}

connectToDatabase();

app.use(cors());
app.use(express.json());

// Rotaları Tanımla
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', authenticateToken, appointmentRoutes);
app.use('/api/medical-records', authenticateToken, medicalRecordRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reminders', authenticateToken, reminderRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} bağlantı noktasında çalışıyor`));