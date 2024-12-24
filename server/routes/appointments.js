import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../config/database.js';
import authenticateToken from '../middleware/authMiddleware.js';

// Tüm randevuları getir (GET /api/appointments)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const request = new sql.Request();
        let query = "";

        // Admin ise tüm randevuları getir
        if (req.user.role === 'admin') {
            query = `SELECT a.*, p.name AS petName, p.ownerId AS ownerId FROM Appointments a JOIN Pets p ON a.petId = p.id`;
        } else {
            // Kullanıcı ise sadece kendi randevularını getir
            query = `SELECT a.*, p.name AS petName, p.ownerId AS ownerId FROM Appointments a JOIN Pets p ON a.petId = p.id WHERE p.ownerId = @ownerId`;
            request.input('ownerId', sql.Int, req.user.id);
        }

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Randevu listesi alınırken hata oluştu:', err.message);
        res.status(500).send('Randevu listesi alınırken bir hata oluştu.');
    }
});

// Yeni bir randevu oluştur (POST /api/appointments)
router.post('/', authenticateToken, async (req, res) => {
    const { petId, date, provider, reason } = req.body;
    try {
        const request = new sql.Request();

        // Kullanıcının yetkisini kontrol et
        let authQuery = 'SELECT ownerId FROM Pets WHERE id = @petId';
        const authResult = await request
            .input('petId', sql.Int, petId)
            .query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Evcil hayvan bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // Randevuyu oluştur
        const insertQuery = `INSERT INTO Appointments (petId, date, provider, reason) VALUES (@petId, @date, @provider, @reason)`;
        const insertResult = await request
            .input('date', sql.DateTime, date)
            .input('provider', sql.VarChar, provider)
            .input('reason', sql.VarChar, reason)
            .query(insertQuery);

        res.status(201).json({ msg: 'Randevu başarıyla eklendi' });
    } catch (err) {
        console.error('Randevu oluşturulurken hata oluştu:', err.message);
        res.status(500).send('Randevu oluşturulurken bir hata oluştu.');
    }
});

// Belirli bir randevuyu getir (GET /api/appointments/:id)
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id);

        // Kullanıcının yetkisini kontrol et
        let authQuery = `SELECT p.ownerId FROM Appointments a JOIN Pets p ON a.petId = p.id WHERE a.id = @id`;
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // Randevuyu getir
        const getQuery = `SELECT * FROM Appointments WHERE id = @id`;
        const getResult = await request.query(getQuery);

        res.json(getResult.recordset[0]);
    } catch (err) {
        console.error('Randevu bilgisi alınırken hata oluştu:', err.message);
        res.status(500).send('Randevu bilgisi alınırken bir hata oluştu.');
    }
});

// Randevuyu güncelle (PUT /api/appointments/:id)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { petId, date, provider, reason } = req.body;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id);

        // Kullanıcının yetkisini kontrol et
        let authQuery = `SELECT p.ownerId FROM Appointments a JOIN Pets p ON a.petId = p.id WHERE a.id = @id`;
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // Randevuyu güncelle
        const updateQuery = `UPDATE Appointments SET petId = @petId, date = @date, provider = @provider, reason = @reason WHERE id = @id`;
        const updateResult = await request
            .input('petId', sql.Int, petId)
            .input('date', sql.DateTime, date)
            .input('provider', sql.VarChar, provider)
            .input('reason', sql.VarChar, reason)
            .query(updateQuery);

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }

        res.json({ msg: 'Randevu güncellendi' });
    } catch (err) {
        console.error('Randevu güncellenirken hata oluştu:', err.message);
        res.status(500).send('Randevu güncellenirken bir hata oluştu.');
    }
});

// Randevuyu sil (DELETE /api/appointments/:id)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id);

        // Kullanıcının yetkisini kontrol et
        const authQuery = `SELECT p.ownerId FROM Appointments a JOIN Pets p ON a.petId = p.id WHERE a.id = @id`;
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // Randevuyu sil
        const deleteQuery = `DELETE FROM Appointments WHERE id = @id`;
        const deleteResult = await request.query(deleteQuery);

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Randevu bulunamadı' });
        }

        res.json({ msg: 'Randevu silindi' });
    } catch (err) {
        console.error('Randevu silinirken hata oluştu:', err.message);
        res.status(500).send('Randevu silinirken bir hata oluştu.');
    }
});

export default router;