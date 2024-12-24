import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../config/database.js';
import authenticateToken from '../middleware/authMiddleware.js';
import Joi from 'joi';

// Tüm evcil hayvanları getir (GET /api/pets)
// Artık yetkilendirme kontrolü var, adminse hepsi, kullanıcı ise sadece kendi hayvanları
router.get('/', authenticateToken, async (req, res) => {
    try {
        const request = new sql.Request();
        let query = "";

        if (req.user.role === 'admin') {
            query = "SELECT * FROM Pets";
        } else {
            query = "SELECT * FROM Pets WHERE ownerId = @ownerId";
            request.input('ownerId', sql.Int, req.user.id);
        }

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Evcil hayvanları alma hatası:', err.message);
        res.status(500).send('Evcil hayvanları alınırken bir hata oluştu.');
    }
});

// Yeni bir evcil hayvan oluştur (POST /api/pets)
// Artık yetkilendirme kontrolü yok, herkes ekleyebilmeli
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
            .input('ownerId', sql.Int, req.user.id) // ownerId eklendi
            .input('name', sql.VarChar, name)
            .input('species', sql.VarChar, species)
            .input('breed', sql.VarChar, breed)
            .input('age', sql.Int, age)
            .input('gender', sql.VarChar, gender)
            .input('medicalHistory', sql.VarChar, medicalHistory);

        const query = `INSERT INTO Pets (ownerId, name, species, breed, age, gender, medicalHistory) VALUES (@ownerId, @name, @species, @breed, @age, @gender, @medicalHistory)`;

        const result = await request.query(query);
        res.status(201).json({ msg: 'Evcil hayvan başarıyla eklendi' });
    } catch (err) {
        console.error('Evcil hayvan ekleme hatası:', err.message);
        res.status(500).send('Evcil hayvan eklenirken bir hata oluştu.');
    }
});

// Belirli bir evcil hayvanı getir (GET /api/pets/:id) - Değişiklik yok
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
// Sadece admin veya ilgili evcil hayvanın sahibi güncelleyebilmeli
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, species, breed, age, gender, medicalHistory } = req.body;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id);

        // Kullanıcının yetkisini kontrol et
        let authQuery = 'SELECT ownerId FROM Pets WHERE id = @id';
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // Güncelleme işlemini yap
        const updateQuery = `UPDATE Pets SET name = @name, species = @species, breed = @breed, age = @age, gender = @gender, medicalHistory = @medicalHistory WHERE id = @id`;
        const updateResult = await request
            .input('name', sql.VarChar, name)
            .input('species', sql.VarChar, species)
            .input('breed', sql.VarChar, breed)
            .input('age', sql.Int, age)
            .input('gender', sql.VarChar, gender)
            .input('medicalHistory', sql.VarChar, medicalHistory)
            .query(updateQuery);

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }

        res.json({ msg: 'Evcil hayvan güncellendi' });
    } catch (err) {
        console.error('Evcil hayvan güncelleme hatası:', err.message);
        res.status(500).send('Evcil hayvan güncellenirken bir hata oluştu.');
    }
});

// Evcil hayvanı sil (DELETE /api/pets/:id)
// Sadece admin veya ilgili evcil hayvanın sahibi silebilsin
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id);

        // Kullanıcının yetkisini kontrol et
        let authQuery = 'SELECT ownerId FROM Pets WHERE id = @id';
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // Silme işlemini yap
        const deleteQuery = `DELETE FROM Pets WHERE id = @id`;
        const deleteResult = await request.query(deleteQuery);

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }

        res.json({ msg: 'Evcil hayvan silindi' });
    } catch (err) {
        console.error('Evcil hayvan silinirken hata oluştu:', err.message);
        res.status(500).send('Evcil hayvan silinirken bir hata oluştu.');
    }
});

// Belirli bir evcil hayvana ait ilaç ve aşıları getir (GET /api/pets/:petId/medications) - Yetkilendirme eklendi
router.get('/:petId/medications', authenticateToken, async (req, res) => {
    const { petId } = req.params;
    try {
        const request = new sql.Request()
            .input('petId', sql.Int, petId);

        // Kullanıcının yetkisini kontrol et
        let authQuery = 'SELECT ownerId FROM Pets WHERE id = @petId';
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // İlaç ve aşıları getir
        const query = `SELECT * FROM Medications WHERE petId = @petId`;
        const result = await request.query(query);

        res.json(result.recordset);
    } catch (err) {
        console.error('İlaç ve aşı bilgileri alınırken hata oluştu:', err.message);
        res.status(500).send('İlaç ve aşı bilgileri alınırken bir hata oluştu.');
    }
});

// Yeni bir ilaç/aşı kaydı oluştur (POST /api/pets/:petId/medications) - Yetkilendirme eklendi
router.post('/:petId/medications', authenticateToken, async (req, res) => {
    const { petId } = req.params;
    const { name, startDate, endDate, dosage, frequency, notes } = req.body;
    try {
        const request = new sql.Request()
            .input('petId', sql.Int, petId);

        // Kullanıcının yetkisini kontrol et
        let authQuery = 'SELECT ownerId FROM Pets WHERE id = @petId';
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // İlaç/aşı kaydını oluştur
        const query = `INSERT INTO Medications (petId, name, startDate, endDate, dosage, frequency, notes) VALUES (@petId, @name, @startDate, @endDate, @dosage, @frequency, @notes)`;
        const result = await request
            .input('name', sql.VarChar, name)
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .input('dosage', sql.VarChar, dosage)
            .input('frequency', sql.VarChar, frequency)
            .input('notes', sql.VarChar, notes)
            .query(query);

        res.status(201).json({ msg: 'İlaç/aşı kaydı başarıyla eklendi' });
    } catch (err) {
        console.error('İlaç/aşı kaydı eklenirken hata oluştu:', err.message);
        res.status(500).send('İlaç/aşı kaydı eklenirken bir hata oluştu.');
    }
});

// Belirli bir ilacı/aşıyı güncelle (PUT /api/pets/:petId/medications/:id) - Yetkilendirme eklendi
router.put('/:petId/medications/:id', authenticateToken, async (req, res) => {
    const { petId, id } = req.params;
    const { name, startDate, endDate, dosage, frequency, notes } = req.body;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id)
            .input('petId', sql.Int, petId);

        // Kullanıcının yetkisini kontrol et
        let authQuery = 'SELECT ownerId FROM Pets WHERE id = @petId';
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // İlaç/aşı kaydını güncelle
        const query = `UPDATE Medications SET name = @name, startDate = @startDate, endDate = @endDate, dosage = @dosage, frequency = @frequency, notes = @notes WHERE id = @id AND petId = @petId`;
        const result = await request
            .input('name', sql.VarChar, name)
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .input('dosage', sql.VarChar, dosage)
            .input('frequency', sql.VarChar, frequency)
            .input('notes', sql.VarChar, notes)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'İlaç/aşı kaydı bulunamadı' });
        }

        res.json({ msg: 'İlaç/aşı kaydı güncellendi' });
    } catch (err) {
        console.error('İlaç/aşı kaydı güncellenirken hata oluştu:', err.message);
        res.status(500).send('İlaç/aşı kaydı güncellenirken bir hata oluştu.');
    }
});

// Belirli bir ilacı/aşıyı sil (DELETE /api/pets/:petId/medications/:id) - Yetkilendirme eklendi
router.delete('/:petId/medications/:id', authenticateToken, async (req, res) => {
    const { petId, id } = req.params;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id)
            .input('petId', sql.Int, petId);

        // Kullanıcının yetkisini kontrol et
        let authQuery = 'SELECT ownerId FROM Pets WHERE id = @petId';
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // İlaç/aşı kaydını sil
        const query = `DELETE FROM Medications WHERE id = @id AND petId = @petId`;
        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'İlaç/aşı kaydı bulunamadı' });
        }

        res.json({ msg: 'İlaç/aşı kaydı silindi' });
    } catch (err) {
        console.error('İlaç/aşı kaydı silinirken hata oluştu:', err.message);
        res.status(500).send('İlaç/aşı kaydı silinirken bir hata oluştu.');
    }
});

export default router;