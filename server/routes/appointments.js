const express = require('express');
const router = express.Router();
const sql = require('mssql'); // mssql paketini import et
const config = require('../config/database'); // config dosyasını import et
const authenticateToken = require('../middleware/authMiddleware');

// Tüm randevuları getir (GET /api/appointments)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await new sql.Request().query("SELECT a.*, p.name AS petName FROM Appointments a JOIN Pets p ON a.petId = p.id"); // Her sorguda yeni bir Request oluştur
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
    const request = new sql.Request(); // Yeni bir Request oluştur
    const result = await request
      .input('petId', sql.Int, petId)
      .input('date', sql.DateTime, date)
      .input('provider', sql.VarChar, provider)
      .input('reason', sql.VarChar, reason)
      .query("INSERT INTO Appointments (petId, date, provider, reason) VALUES (@petId, @date, @provider, @reason)");
    res.status(201).json({ msg: 'Randevu başarıyla eklendi' });
  } catch (err) {
    console.error('Randevu oluşturulurken hata oluştu:', err.message);
    res.status(500).send('Randevu oluşturulurken bir hata oluştu.');
  }
});

// Diğer endpoint'ler için de aynı şekilde new sql.Request() kullanın...

// Belirli bir randevuyu getir (GET /api/appointments/:id)
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await new sql.Request() // Yeni bir Request oluştur
      .input('id', sql.Int, id)
      .query("SELECT * FROM Appointments WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: 'Randevu bulunamadı' });
    }
    res.json(result.recordset[0]);
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
    const request = new sql.Request(); // Yeni bir Request oluştur
    const result = await request
      .input('petId', sql.Int, petId)
      .input('date', sql.DateTime, date)
      .input('provider', sql.VarChar, provider)
      .input('reason', sql.VarChar, reason)
      .input('id', sql.Int, id)
      .query("UPDATE Appointments SET petId = @petId, date = @date, provider = @provider, reason = @reason WHERE id = @id");
    if (result.rowsAffected[0] === 0) {
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
    const result = await new sql.Request() // Yeni bir Request oluştur
      .input('id', sql.Int, id)
      .query("DELETE FROM Appointments WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: 'Randevu bulunamadı' });
    }
    res.json({ msg: 'Randevu silindi' });
  } catch (err) {
    console.error('Randevu silinirken hata oluştu:', err.message);
    res.status(500).send('Randevu silinirken bir hata oluştu.');
  }
});

module.exports = router;