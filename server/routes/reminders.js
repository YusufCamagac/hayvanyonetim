import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../config/database.js';
import authenticateToken from '../middleware/authMiddleware.js';

// Tüm hatırlatıcıları getir (GET /api/reminders)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const request = new sql.Request();
        let query = "";
        if (req.user.role === 'admin') {
            query = `SELECT r.*, p.name AS petName, p.ownerId AS ownerId FROM Reminders r JOIN Pets p ON r.petId = p.id`;
        } else {
            query = `SELECT r.*, p.name AS petName, p.ownerId AS ownerId FROM Reminders r JOIN Pets p ON r.petId = p.id WHERE p.ownerId = @ownerId`;
            request.input('ownerId', sql.Int, req.user.id);
        }
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Hatırlatıcılar alınırken hata oluştu:', err.message);
        res.status(500).send('Hatırlatıcılar alınırken bir hata oluştu.');
    }
});

// Yeni hatırlatıcı oluştur (POST /api/reminders)
router.post('/', authenticateToken, async (req, res) => {
    const { petId, type, date, notes } = req.body;
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

        // Hatırlatıcıyı oluştur
        const insertQuery = `INSERT INTO Reminders (petId, type, date, notes) VALUES (@petId, @type, @date, @notes)`;
        const insertResult = await request
            .input('type', sql.VarChar, type)
            .input('date', sql.DateTime, date)
            .input('notes', sql.VarChar, notes)
            .query(insertQuery);

        res.status(201).json({ msg: 'Hatırlatıcı başarıyla eklendi' });
    } catch (err) {
        console.error('Hatırlatıcı eklenirken hata oluştu:', err.message);
        res.status(500).send('Hatırlatıcı eklenirken bir hata oluştu.');
    }
});

// Belirli bir hatırlatıcıyı getir (GET /api/reminders/:id)
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id);

        // Kullanıcının yetkisini kontrol et
        let authQuery = `SELECT p.ownerId FROM Reminders r JOIN Pets p ON r.petId = p.id WHERE r.id = @id`;
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // Hatırlatıcıyı getir
        const getQuery = `SELECT * FROM Reminders WHERE id = @id`;
        const getResult = await request.query(getQuery);

        res.json(getResult.recordset[0]);
    } catch (err) {
        console.error('Hatırlatıcı bilgisi alınırken hata oluştu:', err.message);
        res.status(500).send('Hatırlatıcı bilgisi alınırken bir hata oluştu.');
    }
});

// Hatırlatıcıyı güncelle (PUT /api/reminders/:id)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { petId, type, date, notes } = req.body;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id);

        // Kullanıcının yetkisini kontrol et
        let authQuery = `SELECT p.ownerId FROM Reminders r JOIN Pets p ON r.petId = p.id WHERE r.id = @id`;
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // Hatırlatıcıyı güncelle
        const updateQuery = `UPDATE Reminders SET petId = @petId, type = @type, date = @date, notes = @notes WHERE id = @id`;
        const updateResult = await request
            .input('petId', sql.Int, petId)
            .input('type', sql.VarChar, type)
            .input('date', sql.DateTime, date)
            .input('notes', sql.VarChar, notes)
            .query(updateQuery);

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }

        res.json({ msg: 'Hatırlatıcı güncellendi' });
    } catch (err) {
        console.error('Hatırlatıcı güncellenirken hata oluştu:', err.message);
        res.status(500).send('Hatırlatıcı güncellenirken bir hata oluştu.');
    }
});

// Hatırlatıcıyı sil (DELETE /api/reminders/:id)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const request = new sql.Request()
            .input('id', sql.Int, id);

        // Kullanıcının yetkisini kontrol et
        const authQuery = `SELECT p.ownerId FROM Reminders r JOIN Pets p ON r.petId = p.id WHERE r.id = @id`;
        const authResult = await request.query(authQuery);

        if (authResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }

        const ownerId = authResult.recordset[0].ownerId;

        if (req.user.role !== 'admin' && req.user.id !== ownerId) {
            return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
        }

        // Hatırlatıcıyı sil
        const deleteQuery = `DELETE FROM Reminders WHERE id = @id`;
        const deleteResult = await request.query(deleteQuery);

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }

        res.json({ msg: 'Hatırlatıcı silindi' });
    } catch (err) {
        console.error('Hatırlatıcı silinirken hata oluştu:', err.message);
        res.status(500).send('Hatırlatıcı silinirken bir hata oluştu.');
    }
});

export default router;