const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database'); // Veritabanı bağlantı bilgileri

// Tüm randevuları getir (GET /api/appointments)
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT a.*, p.name AS petName FROM Appointments a JOIN Pets p ON a.petId = p.id`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).send('Server Error');
    }
});

// Yeni bir randevu oluştur (POST /api/appointments)
router.post('/', async (req, res) => {
    const { petId, date, provider, reason } = req.body;
    try {
        const result = await sql.query`INSERT INTO Appointments (petId, date, provider, reason) VALUES (${petId}, ${date}, ${provider}, ${reason})`;
        res.status(201).json({ msg: 'Randevu başarıyla eklendi', insertId: result.insertId }); // Düzeltildi: insertId eklenmesi
    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).send('Server Error');
    }
});

// Belirli bir randevuyu getir (GET /api/appointments/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Appointments WHERE id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching appointment:', err);
        res.status(500).send('Server Error');
    }
});

// Randevuyu güncelle (PUT /api/appointments/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { petId, date, provider, reason } = req.body;
    try {
        const result = await sql.query`UPDATE Appointments SET petId = ${petId}, date = ${date}, provider = ${provider}, reason = ${reason} WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }
        res.json({ msg: 'Randevu güncellendi' });
    } catch (err) {
        console.error('Error updating appointment:', err);
        res.status(500).send('Server Error');
    }
});

// Randevuyu sil (DELETE /api/appointments/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`DELETE FROM Appointments WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }
        res.json({ msg: 'Randevu silindi' });
    } catch (err) {
        console.error('Error deleting appointment:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;