const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database');

// Tüm tıbbi kayıtları getir (GET /api/medical-records)
router.get('/', async (req, res) => {
    try {
        const query = `SELECT mr.*, p.name AS petName FROM MedicalRecords mr JOIN Pets p ON mr.petId = p.id`;
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Tıbbi kayıtlar alınırken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Yeni bir tıbbi kayıt oluştur (POST /api/medical-records)
router.post('/', async (req, res) => {
    const { petId, recordDate, description } = req.body;
    try {
        const query = `INSERT INTO MedicalRecords (petId, recordDate, description) VALUES (@petId, @recordDate, @description)`;
        const request = new sql.Request();
        request.input('petId', sql.Int, petId);
        request.input('recordDate', sql.DateTime, recordDate);
        request.input('description', sql.Text, description);

        const result = await request.query(query);
        res.status(201).json({ msg: 'Tıbbi kayıt başarıyla eklendi' });
    } catch (err) {
        console.error('Tıbbi kayıt eklenirken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Belirli bir tıbbi kaydı getir (GET /api/medical-records/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `SELECT * FROM MedicalRecords WHERE id = @id`;
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Tıbbi kayıt getirilirken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Tıbbi kaydı güncelle (PUT /api/medical-records/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { petId, recordDate, description } = req.body;
    try {
        const query = `UPDATE MedicalRecords SET petId = @petId, recordDate = @recordDate, description = @description WHERE id = @id`;
        const request = new sql.Request()
            .input('petId', sql.Int, petId)
            .input('recordDate', sql.DateTime, recordDate)
            .input('description', sql.Text, description)
            .input('id', sql.Int, id);

        const result = await request.query(query);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
        }
        res.json({ msg: 'Tıbbi kayıt güncellendi' });
    } catch (err) {
        console.error('Tıbbi kayıt güncellenirken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Tıbbi kaydı sil (DELETE /api/medical-records/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM MedicalRecords WHERE id = @id`;
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
        }
        res.json({ msg: 'Tıbbi kayıt silindi' });
    } catch (err) {
        console.error('Tıbbi kayıt silinirken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

module.exports = router;