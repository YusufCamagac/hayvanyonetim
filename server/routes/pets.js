const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database');
const authenticateToken = require('../middleware/authMiddleware');
const Joi = require('joi');

// ... (diğer endpoint'ler)

// Yeni bir evcil hayvan oluştur (POST /api/pets) - Artık herkes ekleyebilmeli
router.post('/', authenticateToken, async (req, res) => {
    // Joi ile doğrulama şeması (değişiklik yok)
    const schema = Joi.object({
        name: Joi.string().required().min(1).max(255),
        species: Joi.string().required().min(1).max(255),
        breed: Joi.string().max(255).allow(null, ''),
        age: Joi.number().integer().min(0).max(30),
        gender: Joi.string().valid('Erkek', 'Dişi', 'Belirsiz').required(),
        medicalHistory: Joi.string().max(1000).allow(null, ''),
    });

    // Doğrulama işlemini yap (değişiklik yok)
    const { error, value } = schema.validate(req.body);

    // Doğrulama hatası varsa, 400 Bad Request döndür (değişiklik yok)
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }

    const { name, species, breed, age, gender, medicalHistory } = value;
    try {
        const request = new sql.Request()
            .input('name', sql.VarChar, name)
            .input('species', sql.VarChar, species)
            .input('breed', sql.VarChar, breed)
            .input('age', sql.Int, age)
            .input('gender', sql.VarChar, gender)
            .input('medicalHistory', sql.VarChar, medicalHistory)
            .query("INSERT INTO Pets (name, species, breed, age, gender, medicalHistory) VALUES (@name, @species, @breed, @age, @gender, @medicalHistory)");

        res.status(201).json({ msg: 'Evcil hayvan başarıyla eklendi' });
    } catch (err) {
        console.error('Evcil hayvan ekleme hatası:', err.message);
        res.status(500).send('Evcil hayvan eklenirken bir hata oluştu.');
    }
});

// Belirli bir evcil hayvanı getir (GET /api/pets/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM Pets WHERE id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Evcil hayvan getirme hatası:', err.message);
        res.status(500).send('Evcil hayvan bilgileri alınırken bir hata oluştu.');
    }
});

// Evcil hayvanı güncelle (PUT /api/pets/:id)
router.put('/:id', authenticateToken, async (req, res) => {
    // Sadece admin rolüne sahip kullanıcılar güncelleyebilsin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
    }
    const { id } = req.params;
    const { name, species, breed, age, gender, medicalHistory } = req.body;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar, name)
            .input('species', sql.VarChar, species)
            .input('breed', sql.VarChar, breed)
            .input('age', sql.Int, age)
            .input('gender', sql.VarChar, gender)
            .input('medicalHistory', sql.VarChar, medicalHistory)
            .query("UPDATE Pets SET name = @name, species = @species, breed = @breed, age = @age, gender = @gender, medicalHistory = @medicalHistory WHERE id = @id");
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }
        res.json({ msg: 'Evcil hayvan güncellendi' });
    } catch (err) {
        console.error('Evcil hayvan güncelleme hatası:', err.message);
        res.status(500).send('Evcil hayvan güncellenirken bir hata oluştu.');
    }
});

// Evcil hayvanı sil (DELETE /api/pets/:id)
router.delete('/:id', authenticateToken, async (req, res) => {
    // Sadece admin rolüne sahip kullanıcılar silebilsin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
    }
    const { id } = req.params;
    try {
        // Önce varsa ilgili randevuları, hatırlatıcıları ve tıbbi kayıtları sil
        await sql.query`DELETE FROM Appointments WHERE petId = ${id}`;
        await sql.query`DELETE FROM MedicalRecords WHERE petId = ${id}`;
        await sql.query`DELETE FROM Reminders WHERE petId = ${id}`;
        await sql.query`DELETE FROM Medications WHERE petId = ${id}`;

        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Pets WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }
        res.json({ msg: 'Evcil hayvan silindi' });
    } catch (err) {
        console.error('Evcil hayvan silinirken hata oluştu:', err.message);
        res.status(500).send('Evcil hayvan silinirken bir hata oluştu.');
    }
});

// Belirli bir evcil hayvana ait ilaç ve aşıları getir (GET /api/pets/:petId/medications)
router.get('/:petId/medications', authenticateToken, async (req, res) => {
    const { petId } = req.params;
    try {
        const result = await new sql.Request()
            .input('petId', sql.Int, petId)
            .query("SELECT * FROM Medications WHERE petId = @petId");

        res.json(result.recordset);
    } catch (err) {
        console.error('İlaç ve aşı bilgileri alınırken hata oluştu:', err.message);
        res.status(500).send('İlaç ve aşı bilgileri alınırken bir hata oluştu.');
    }
});

// Yeni bir ilaç/aşı kaydı oluştur (POST /api/pets/:petId/medications)
router.post('/:petId/medications', authenticateToken, async (req, res) => {
    const { petId } = req.params;
    const { name, startDate, endDate, dosage, frequency, notes } = req.body;
    try {
        const request = new sql.Request();
        const result = await request
            .input('petId', sql.Int, petId)
            .input('name', sql.VarChar, name)
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .input('dosage', sql.VarChar, dosage)
            .input('frequency', sql.VarChar, frequency)
            .input('notes', sql.VarChar, notes)
            .query("INSERT INTO Medications (petId, name, startDate, endDate, dosage, frequency, notes) VALUES (@petId, @name, @startDate, @endDate, @dosage, @frequency, @notes)");
        res.status(201).json({ msg: 'İlaç/aşı kaydı başarıyla eklendi' });
    } catch (err) {
        console.error('İlaç/aşı kaydı eklenirken hata oluştu:', err.message);
        res.status(500).send('İlaç/aşı kaydı eklenirken bir hata oluştu.');
    }
});

// Belirli bir ilacı/aşıyı güncelle (PUT /api/pets/:petId/medications/:id)
router.put('/:petId/medications/:id', authenticateToken, async (req, res) => {
    const { petId, id } = req.params;
    const { name, startDate, endDate, dosage, frequency, notes } = req.body;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id)
            .input('petId', sql.Int, petId)
            .input('name', sql.VarChar, name)
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .input('dosage', sql.VarChar, dosage)
            .input('frequency', sql.VarChar, frequency)
            .input('notes', sql.VarChar, notes)
            .query("UPDATE Medications SET name = @name, startDate = @startDate, endDate = @endDate, dosage = @dosage, frequency = @frequency, notes = @notes WHERE id = @id AND petId = @petId");
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'İlaç/aşı kaydı bulunamadı' });
        }
        res.json({ msg: 'İlaç/aşı kaydı güncellendi' });
    } catch (err) {
        console.error('İlaç/aşı kaydı güncellenirken hata oluştu:', err.message);
        res.status(500).send('İlaç/aşı kaydı güncellenirken bir hata oluştu.');
    }
});

// Belirli bir ilacı/aşıyı sil (DELETE /api/pets/:petId/medications/:id)
router.delete('/:petId/medications/:id', authenticateToken, async (req, res) => {
    const { petId, id } = req.params;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id)
            .input('petId', sql.Int, petId)
            .query("DELETE FROM Medications WHERE id = @id AND petId = @petId");
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'İlaç/aşı kaydı bulunamadı' });
        }
        res.json({ msg: 'İlaç/aşı kaydı silindi' });
    } catch (err) {
        console.error('İlaç/aşı kaydı silinirken hata oluştu:', err.message);
        res.status(500).send('İlaç/aşı kaydı silinirken bir hata oluştu.');
    }
});

module.exports = router;