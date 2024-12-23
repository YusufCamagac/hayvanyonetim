const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database');

// Tüm randevuları getir (GET /api/appointments)
router.get('/', async (req, res) => {
    try {
        const query = `SELECT * FROM vw_AppointmentsWithPets`; // View kullanımı
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Randevu listesi alınırken hata oluştu:', err.message);
        res.status(500).send('Server Error');
    }
});

// Yeni bir randevu oluştur (POST /api/appointments)
router.post('/', async (req, res) => {
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

// Belirli bir randevuyu getir (GET /api/appointments/:id)
router.get('/:id', async (req, res) => {
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

// Randevuyu güncelle (PUT /api/appointments/:id)
router.put('/:id', async (req, res) => {
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

// Randevuyu sil (DELETE /api/appointments/:id)
router.delete('/:id', async (req, res) => {
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