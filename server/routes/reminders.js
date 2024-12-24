const express = require('express');
const router = express.Router();
const sql = require('mssql'); // mssql paketini import et
const config = require('../config/database'); // config dosyasını import et
const authenticateToken = require('../middleware/authMiddleware');

// Tüm hatırlatıcıları getir (GET /api/reminders)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await new sql.Request().query("SELECT r.*, p.name AS petName FROM Reminders r JOIN Pets p ON r.petId = p.id");
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
        const result = await request
            .input('petId', sql.Int, petId)
            .input('type', sql.VarChar, type)
            .input('date', sql.DateTime, date)
            .input('notes', sql.VarChar, notes)
            .query("INSERT INTO Reminders (petId, type, date, notes) VALUES (@petId, @type, @date, @notes)");
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
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM Reminders WHERE id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }
        res.json(result.recordset[0]);
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
        const request = new sql.Request();
        const result = await request
            .input('petId', sql.Int, petId)
            .input('type', sql.VarChar, type)
            .input('date', sql.DateTime, date)
            .input('notes', sql.VarChar, notes)
            .input('id', sql.Int, id)
            .query("UPDATE Reminders SET petId = @petId, type = @type, date = @date, notes = @notes WHERE id = @id");
        if (result.rowsAffected[0] === 0) {
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
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Reminders WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }
        res.json({ msg: 'Hatırlatıcı silindi' });
    } catch (err) {
        console.error('Hatırlatıcı silinirken hata oluştu:', err.message);
        res.status(500).send('Hatırlatıcı silinirken bir hata oluştu.');
    }
});

module.exports = router;