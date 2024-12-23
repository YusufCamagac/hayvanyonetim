const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database');
const authenticateToken = require('../middleware/authMiddleware');
const Joi = require('joi');

// Tüm evcil hayvanları getir (GET /api/pets)
router.get('/', async (req, res) => {
  try {
    const query = `SELECT * FROM Pets`;
    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Evcil hayvanları alma hatası:', err.message);
    res.status(500).send('Server Error');
  }
});

// Yeni bir evcil hayvan oluştur (POST /api/pets)
router.post('/', authenticateToken, async (req, res) => {
  // Sadece admin rolüne sahip kullanıcılar ekleyebilsin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  // Joi ile doğrulama şeması
  const schema = Joi.object({
    name: Joi.string().required().min(1).max(255),
    species: Joi.string().required().min(1).max(255),
    breed: Joi.string().max(255).allow(null, ''),
    age: Joi.number().integer().min(0).max(30),
    gender: Joi.string().valid('Erkek', 'Dişi', 'Belirsiz').required(),
    medicalHistory: Joi.string().allow(null, ''),
  });

  // Doğrulama işlemini yap
  const { error, value } = schema.validate(req.body);

  // Doğrulama hatası varsa, 400 Bad Request döndür
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const { name, species, breed, age, gender, medicalHistory } = value; // Doğrulanmış verileri kullan
  try {
    const query = `INSERT INTO Pets (name, species, breed, age, gender, medicalHistory) VALUES (@name, @species, @breed, @age, @gender, @medicalHistory)`;
    const request = new sql.Request();
    request.input('name', sql.VarChar, name);
    request.input('species', sql.VarChar, species);
    request.input('breed', sql.VarChar, breed);
    request.input('age', sql.Int, age);
    request.input('gender', sql.VarChar, gender);
    request.input('medicalHistory', sql.Text, medicalHistory);

    await request.query(query);
    res.status(201).json({ msg: 'Evcil hayvan başarıyla eklendi' });
  } catch (err) {
    console.error('Evcil hayvan ekleme hatası:', err.message);
    res.status(500).send('Server Error');
  }
});

// Belirli bir evcil hayvana ait ilaç ve aşıları getir (GET /api/pets/:petId/medications)
router.get('/:petId/medications', authenticateToken, async (req, res) => {
    const { petId } = req.params;
    try {
        const query = `SELECT * FROM Medications WHERE petId = @petId`;
        const result = await new sql.Request()
            .input('petId', sql.Int, petId)
            .query(query);

        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching pet medications:', err.message);
        res.status(500).send('Server Error');
    }
});

// Yeni bir ilaç/aşı kaydı oluştur (POST /api/pets/:petId/medications)
router.post('/:petId/medications', authenticateToken, async (req, res) => {
    const { petId } = req.params;
    const { name, startDate, endDate, dosage, frequency, notes } = req.body;
    try {
        const query = `INSERT INTO Medications (petId, name, startDate, endDate, dosage, frequency, notes) VALUES (@petId, @name, @startDate, @endDate, @dosage, @frequency, @notes)`;
        const request = new sql.Request();
        request.input('petId', sql.Int, petId);
        request.input('name', sql.VarChar, name);
        request.input('startDate', sql.Date, startDate);
        request.input('endDate', sql.Date, endDate);
        request.input('dosage', sql.VarChar, dosage);
        request.input('frequency', sql.VarChar, frequency);
        request.input('notes', sql.Text, notes);

        const result = await request.query(query);
        res.status(201).json({ msg: 'İlaç/aşı kaydı başarıyla eklendi', insertId: result.insertId });
    } catch (err) {
        console.error('Error creating medication:', err.message);
        res.status(500).send('Server Error');
    }
});

// Belirli bir ilacı/aşıyı güncelle (PUT /api/pets/:petId/medications/:id)
router.put('/:petId/medications/:id', authenticateToken, async (req, res) => {
    const { petId, id } = req.params;
    const { name, startDate, endDate, dosage, frequency, notes } = req.body;
    try {
        const query = `UPDATE Medications SET name = @name, startDate = @startDate, endDate = @endDate, dosage = @dosage, frequency = @frequency, notes = @notes WHERE id = @id AND petId = @petId`;
        const request = new sql.Request()
            .input('id', sql.Int, id)
            .input('petId', sql.Int, petId)
            .input('name', sql.VarChar, name)
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .input('dosage', sql.VarChar, dosage)
            .input('frequency', sql.VarChar, frequency)
            .input('notes', sql.Text, notes);

        const result = await request.query(query);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'İlaç/aşı kaydı bulunamadı' });
        }
        res.json({ msg: 'İlaç/aşı kaydı güncellendi' });
    } catch (err) {
        console.error('Error updating medication:', err.message);
        res.status(500).send('Server Error');
    }
});

// Belirli bir ilacı/aşıyı sil (DELETE /api/pets/:petId/medications/:id)
router.delete('/:petId/medications/:id', authenticateToken, async (req, res) => {
    const { petId, id } = req.params;
    try {
        const query = `DELETE FROM Medications WHERE id = @id AND petId = @petId`;
        const request = new sql.Request()
            .input('id', sql.Int, id)
            .input('petId', sql.Int, petId);

        const result = await request.query(query);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'İlaç/aşı kaydı bulunamadı' });
        }
        res.json({ msg: 'İlaç/aşı kaydı silindi' });
    } catch (err) {
        console.error('Error deleting medication:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;