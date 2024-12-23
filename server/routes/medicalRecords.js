const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database'); // Veritabanı bağlantı bilgileri

// Tüm tıbbi kayıtları getir (GET /api/medical-records)
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT mr.*, p.name AS petName FROM MedicalRecords mr JOIN Pets p ON mr.petId = p.id`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching medical records:', err);
        res.status(500).send('Server Error');
    }
});

// Yeni bir tıbbi kayıt oluştur (POST /api/medical-records)
router.post('/', async (req, res) => {
    const { petId, recordDate, description } = req.body;
    try {
        const result = await sql.query`INSERT INTO MedicalRecords (petId, recordDate, description) VALUES (${petId}, ${recordDate}, ${description})`;
        res.status(201).json({ msg: 'Tıbbi kayıt başarıyla eklendi', insertId: result.insertId }); // Düzeltildi: insertId eklenmesi
    } catch (err) {
        console.error('Error creating medical record:', err);
        res.status(500).send('Server Error');
    }
});

// Belirli bir tıbbi kaydı getir (GET /api/medical-records/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM MedicalRecords WHERE id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching medical record:', err);
        res.status(500).send('Server Error');
    }
});

// Tıbbi kaydı güncelle (PUT /api/medical-records/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { petId, recordDate, description } = req.body;
    try {
        const result = await sql.query`UPDATE MedicalRecords SET petId = ${petId}, recordDate = ${recordDate}, description = ${description} WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
        }
        res.json({ msg: 'Tıbbi kayıt güncellendi' });
    } catch (err) {
        console.error('Error updating medical record:', err);
        res.status(500).send('Server Error');
    }
});

// Tıbbi kaydı sil (DELETE /api/medical-records/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`DELETE FROM MedicalRecords WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
        }
        res.json({ msg: 'Tıbbi kayıt silindi' });
    } catch (err) {
        console.error('Error deleting medical record:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;