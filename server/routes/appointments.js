const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database'); // Veritabanı bağlantı bilgileri
const authenticateToken = require('../middleware/authMiddleware');

// Tüm randevuları getir (GET /api/appointments) - Yetkilendirme eklendi
router.get('/', authenticateToken, async (req, res) => {
    try {
        const query = `SELECT a.*, p.name AS petName FROM Appointments a JOIN Pets p ON a.petId = p.id`;
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Randevu listesi alınırken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Yeni bir randevu oluştur (POST /api/appointments) - Yetkilendirme eklendi
router.post('/', authenticateToken, async (req, res) => {
    const { petId, date, provider, reason } = req.body;
    try {
        const query = `INSERT INTO Appointments (petId, date, provider, reason) VALUES (@petId, @date, @provider, @reason)`;
        const request = new sql.Request();
        request.input('petId', sql.Int, petId);
        request.input('date', sql.DateTime, date);
        request.input('provider', sql.VarChar, provider);
        request.input('reason', sql.VarChar, reason);

        const result = await request.query(query);
        res.status(201).json({ msg: 'Randevu başarıyla eklendi' });
    } catch (err) {
        console.error('Randevu oluşturulurken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Belirli bir randevuyu getir (GET /api/appointments/:id) - Yetkilendirme eklendi
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `SELECT * FROM Appointments WHERE id = @id`;
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Randevu bilgisi alınırken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Randevuyu güncelle (PUT /api/appointments/:id) - Yetkilendirme eklendi
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { petId, date, provider, reason } = req.body;
    try {
        const query = `UPDATE Appointments SET petId = @petId, date = @date, provider = @provider, reason = @reason WHERE id = @id`;
        const request = new sql.Request()
            .input('petId', sql.Int, petId)
            .input('date', sql.DateTime, date)
            .input('provider', sql.VarChar, provider)
            .input('reason', sql.VarChar, reason)
            .input('id', sql.Int, id);

        const result = await request.query(query);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }
        res.json({ msg: 'Randevu güncellendi' });
    } catch (err) {
        console.error('Randevu güncellenirken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Randevuyu sil (DELETE /api/appointments/:id) - Yetkilendirme eklendi
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM Appointments WHERE id = @id`;
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }
        res.json({ msg: 'Randevu silindi' });
    } catch (err) {
        console.error('Randevu silinirken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

module.exports = router;