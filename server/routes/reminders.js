const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database'); // Veritabanı bağlantı bilgileri

// Tüm hatırlatıcıları getir (GET /api/reminders)
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT r.*, p.name AS petName FROM Reminders r JOIN Pets p ON r.petId = p.id`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching reminders:', err);
        res.status(500).send('Server Error');
    }
});

// Yeni hatırlatıcı oluştur (POST /api/reminders)
router.post('/', async (req, res) => {
    const { petId, type, date, notes } = req.body;
    try {
        const result = await sql.query`INSERT INTO Reminders (petId, type, date, notes) VALUES (${petId}, ${type}, ${date}, ${notes})`;
        res.status(201).json({ msg: 'Hatırlatıcı başarıyla eklendi', insertId: result.insertId }); // Düzeltildi: insertId eklenmesi
    } catch (err) {
        console.error('Error creating reminder:', err);
        res.status(500).send('Server Error');
    }
});

// Belirli bir hatırlatıcıyı getir (GET /api/reminders/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Reminders WHERE id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching reminder:', err);
        res.status(500).send('Server Error');
    }
});

// Hatırlatıcıyı güncelle (PUT /api/reminders/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { petId, type, date, notes } = req.body;
    try {
        const result = await sql.query`UPDATE Reminders SET petId = ${petId}, type = ${type}, date = ${date}, notes = ${notes} WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }
        res.json({ msg: 'Hatırlatıcı güncellendi' });
    } catch (err) {
        console.error('Error updating reminder:', err);
        res.status(500).send('Server Error');
    }
});

// Hatırlatıcıyı sil (DELETE /api/reminders/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`DELETE FROM Reminders WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }
        res.json({ msg: 'Hatırlatıcı silindi' });
    } catch (err) {
        console.error('Error deleting reminder:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;