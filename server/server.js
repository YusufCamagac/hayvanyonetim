require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const config = require('./config/database');

// Rotalar
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

// Veritabanı Bağlantısı
async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log('Veritabanı bağlandı...');
    } catch (err) {
        console.error('Veritabanına bağlanılamadı:', err);
    }
}

connectToDatabase();

app.use(cors());
app.use(express.json());

// Rotaları Tanımla
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} bağlantı noktasında çalışıyor`));