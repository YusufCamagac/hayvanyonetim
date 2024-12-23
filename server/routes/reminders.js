const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database');
const authenticateToken = require('../middleware/authMiddleware');

// Tüm hatırlatıcıları getir (GET /api/reminders) - Yetkilendirme eklendi
router.get('/', authenticateToken, async (req, res) => {
    try {
        const query = `SELECT r.*, p.name AS petName FROM Reminders r JOIN Pets p ON r.petId = p.id`;
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Hatırlatıcılar alınırken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Yeni hatırlatıcı oluştur (POST /api/reminders) - Yetkilendirme eklendi
router.post('/', authenticateToken, async (req, res) => {
    const { petId, type, date, notes } = req.body;
    try {
        const query = `INSERT INTO Reminders (petId, type, date, notes) VALUES (@petId, @type, @date, @notes)`;
        const request = new sql.Request();
        request.input('petId', sql.Int, petId);
        request.input('type', sql.VarChar, type);
        request.input('date', sql.DateTime, date);
        request.input('notes', sql.Text, notes);

        const result = await request.query(query);
        res.status(201).json({ msg: 'Hatırlatıcı başarıyla eklendi' });
    } catch (err) {
        console.error('Hatırlatıcı eklenirken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Belirli bir hatırlatıcıyı getir (GET /api/reminders/:id) - Yetkilendirme eklendi
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `SELECT * FROM Reminders WHERE id = @id`;
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Hatırlatıcı bilgisi alınırken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Hatırlatıcıyı güncelle (PUT /api/reminders/:id) - Yetkilendirme eklendi
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { petId, type, date, notes } = req.body;
    try {
        const query = `UPDATE Reminders SET petId = @petId, type = @type, date = @date, notes = @notes WHERE id = @id`;
        const request = new sql.Request()
            .input('petId', sql.Int, petId)
            .input('type', sql.VarChar, type)
            .input('date', sql.DateTime, date)
            .input('notes', sql.Text, notes)
            .input('id', sql.Int, id);

        const result = await request.query(query);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }
        res.json({ msg: 'Hatırlatıcı güncellendi' });
    } catch (err) {
        console.error('Hatırlatıcı güncellenirken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

// Hatırlatıcıyı sil (DELETE /api/reminders/:id) - Yetkilendirme eklendi
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM Reminders WHERE id = @id`;
        const result = await new sql.Request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Hatırlatıcı bulunamadı' });
        }
        res.json({ msg: 'Hatırlatıcı silindi' });
    } catch (err) {
        console.error('Hatırlatıcı silinirken hata oluştu:', err.message);
        res.status(500).send('Sunucu Hatası');
    }
});

module.exports = router;