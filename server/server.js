require('dotenv').config({ path: '../.env' }); // .env dosyası ana dizinde
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const config = require('./config/database'); // database.js dosyasını kullan

// Rotalar
const petRoutes = require('./routes/pets');
const appointmentRoutes = require('./routes/appointments');
const medicalRecordRoutes = require('./routes/medicalRecords');
const userRoutes = require('./routes/users');
const reminderRoutes = require('./routes/reminders');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware'i import edin
const authenticateToken = require('./middleware/authMiddleware');

// Veritabanı Bağlantısı
async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log('Veritabanı bağlandı...');
    } catch (err) {
        console.error('Veritabanına bağlanılamadı:', err);
        // process.exit(1); // Uygulamadan çıkmak yerine hatayı yönet
        // Burada kullanıcıya bir hata mesajı gösterebilirsiniz (örneğin, res.status(500).send('Veritabanına bağlanılamadı.'))
        // Veya, belirli bir süre sonra tekrar bağlanmayı deneyebilirsiniz.
    }
}

connectToDatabase();

app.use(cors());
app.use(express.json());

// Rotaları Tanımla
// Kimlik doğrulama gerektirmeyen rotalar (herkes erişebilir)
app.use('/api/auth', authRoutes);

// Kimlik doğrulama gerektiren rotalar (sadece giriş yapmış kullanıcılar erişebilir)
app.use('/api/pets', authenticateToken, petRoutes);
app.use('/api/appointments', authenticateToken, appointmentRoutes);
app.use('/api/medical-records', authenticateToken, medicalRecordRoutes);
app.use('/api/users', authenticateToken, userRoutes); // Kullanıcı yönetimi rotalarını da koru
app.use('/api/reminders', authenticateToken, reminderRoutes);

// Raporlar rotası (sadece admin erişebilir)
app.use('/api/reports', authenticateToken, reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} bağlantı noktasında çalışıyor`));