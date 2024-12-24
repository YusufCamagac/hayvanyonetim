import 'dotenv/config'; // ES modülü olarak dotenv yükle
import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import config from './config/database.js';

// Rotalar
import petRoutes from './routes/pets.js';
import appointmentRoutes from './routes/appointments.js';
import medicalRecordRoutes from './routes/medicalRecords.js';
import userRoutes from './routes/users.js';
import reminderRoutes from './routes/reminders.js';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';

const app = express();

// Middleware
import authenticateToken from './middleware/authMiddleware.js';

// Veritabanı Bağlantısı
async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Veritabanına bağlandı...');
  } catch (err) {
    console.error('Veritabanına bağlanılamadı:', err);
    process.exit(1); // Uygulamayı durdur
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