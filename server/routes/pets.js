const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database'); // database.js dosyasının yolunu güncelleyin

// Tüm evcil hayvanları getir (GET /api/pets)
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Pets`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).send('Server Error');
    }
});

// Yeni bir evcil hayvan oluştur (POST /api/pets)
router.post('/', async (req, res) => {
    const { name, species, breed, age, gender, medicalHistory } = req.body;
    try {
        const result = await sql.query`INSERT INTO Pets (name, species, breed, age, gender, medicalHistory) VALUES (${name}, ${species}, ${breed}, ${age}, ${gender}, ${medicalHistory})`;
        res.status(201).json({ msg: 'Evcil hayvan başarıyla eklendi', insertId: result.insertId }); //insertId hatası düzeltildi
    } catch (err) {
        console.error('Error creating pet:', err);
        res.status(500).send('Server Error');
    }
});

// Belirli bir evcil hayvanı getir (GET /api/pets/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Pets WHERE id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching pet:', err);
        res.status(500).send('Server Error');
    }
});

// Evcil hayvanı güncelle (PUT /api/pets/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, species, breed, age, gender, medicalHistory } = req.body;
    try {
        const result = await sql.query`UPDATE Pets SET name = ${name}, species = ${species}, breed = ${breed}, age = ${age}, gender = ${gender}, medicalHistory = ${medicalHistory} WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }
        res.json({ msg: 'Evcil hayvan güncellendi' });
    } catch (err) {
        console.error('Error updating pet:', err);
        res.status(500).send('Server Error');
    }
});

// Evcil hayvanı sil (DELETE /api/pets/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`DELETE FROM Pets WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }
        res.json({ msg: 'Evcil hayvan silindi' });
    } catch (err) {
        console.error('Error deleting pet:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;