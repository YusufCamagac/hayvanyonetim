const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database');

// Tüm evcil hayvanları getir (GET /api/pets)
router.get('/', async (req, res) => {
    try {
        const query = `SELECT * FROM Pets`;
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching pets:', err.message);
        res.status(500).send('Server Error');
    }
});

// Yeni bir evcil hayvan oluştur (POST /api/pets)
router.post('/', async (req, res) => {
    const { name, species, breed, age, gender, medicalHistory } = req.body;
    try {
        const query = `INSERT INTO Pets (name, species, breed, age, gender, medicalHistory) VALUES (@name, @species, @breed, @age, @gender, @medicalHistory)`;
        const request = new sql.Request();
        request.input('name', sql.VarChar, name);
        request.input('species', sql.VarChar, species);
        request.input('breed', sql.VarChar, breed);
        request.input('age', sql.Int, age);
        request.input('gender', sql.VarChar, gender);
        request.input('medicalHistory', sql.Text, medicalHistory);

        const result = await request.query(query);
        res.status(201).json({ msg: 'Evcil hayvan başarıyla eklendi' });
    } catch (err) {
        console.error('Error creating pet:', err.message);
        res.status(500).send('Server Error');
    }
});

// Belirli bir evcil hayvanı getir (GET /api/pets/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `SELECT * FROM Pets WHERE id = @id`;
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching pet:', err.message);
        res.status(500).send('Server Error');
    }
});

// Evcil hayvanı güncelle (PUT /api/pets/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, species, breed, age, gender, medicalHistory } = req.body;
    try {
        const query = `UPDATE Pets SET name = @name, species = @species, breed = @breed, age = @age, gender = @gender, medicalHistory = @medicalHistory WHERE id = @id`;
        const request = new sql.Request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar, name)
            .input('species', sql.VarChar, species)
            .input('breed', sql.VarChar, breed)
            .input('age', sql.Int, age)
            .input('gender', sql.VarChar, gender)
            .input('medicalHistory', sql.Text, medicalHistory);

        const result = await request.query(query);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }
        res.json({ msg: 'Evcil hayvan güncellendi' });
    } catch (err) {
        console.error('Error updating pet:', err.message);
        res.status(500).send('Server Error');
    }
});

// Evcil hayvanı sil (DELETE /api/pets/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM Pets WHERE id = @id`;
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }
        res.json({ msg: 'Evcil hayvan silindi' });
    } catch (err) {
        console.error('Error deleting pet:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;