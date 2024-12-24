const express = require('express');
const router = express.Router();
const sql = require('mssql'); // mssql paketini import et
const config = require('../config/database'); // config dosyasını import et
const authenticateToken = require('../middleware/authMiddleware');

// Tüm tıbbi kayıtları getir (GET /api/medical-records)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await new sql.Request().query("SELECT mr.*, p.name AS petName FROM MedicalRecords mr JOIN Pets p ON mr.petId = p.id");
    res.json(result.recordset);
  } catch (err) {
    console.error('Tıbbi kayıtlar alınırken hata oluştu:', err.message);
    res.status(500).send('Tıbbi kayıtlar alınırken bir hata oluştu.');
  }
});

// Yeni bir tıbbi kayıt oluştur (POST /api/medical-records)
router.post('/', authenticateToken, async (req, res) => {
  const { petId, recordDate, description } = req.body;
  try {
    const request = new sql.Request();
    const result = await request
      .input('petId', sql.Int, petId)
      .input('recordDate', sql.DateTime, recordDate)
      .input('description', sql.VarChar, description)
      .query("INSERT INTO MedicalRecords (petId, recordDate, description) VALUES (@petId, @recordDate, @description)");
    res.status(201).json({ msg: 'Tıbbi kayıt başarıyla eklendi' });
  } catch (err) {
    console.error('Tıbbi kayıt eklenirken hata oluştu:', err.message);
    res.status(500).send('Tıbbi kayıt eklenirken bir hata oluştu.');
  }
});

// Belirli bir tıbbi kaydı getir (GET /api/medical-records/:id)
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await new sql.Request()
      .input('id', sql.Int, id)
      .query("SELECT * FROM MedicalRecords WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Tıbbi kayıt getirilirken hata oluştu:', err.message);
    res.status(500).send('Tıbbi kayıt getirilirken bir hata oluştu.');
  }
});

// Tıbbi kaydı güncelle (PUT /api/medical-records/:id)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { petId, recordDate, description } = req.body;
  try {
    const request = new sql.Request();
    const result = await request
      .input('petId', sql.Int, petId)
      .input('recordDate', sql.DateTime, recordDate)
      .input('description', sql.VarChar, description)
      .input('id', sql.Int, id)
      .query("UPDATE MedicalRecords SET petId = @petId, recordDate = @recordDate, description = @description WHERE id = @id");
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
    }
    res.json({ msg: 'Tıbbi kayıt güncellendi' });
  } catch (err) {
    console.error('Tıbbi kayıt güncellenirken hata oluştu:', err.message);
    res.status(500).send('Tıbbi kayıt güncellenirken bir hata oluştu.');
  }
});

// Tıbbi kaydı sil (DELETE /api/medical-records/:id)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await new sql.Request()
      .input('id', sql.Int, id)
      .query("DELETE FROM MedicalRecords WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
    }
    res.json({ msg: 'Tıbbi kayıt silindi' });
  } catch (err) {
    console.error('Tıbbi kayıt silinirken hata oluştu:', err.message);
    res.status(500).send('Tıbbi kayıt silinirken bir hata oluştu.');
  }
});

module.exports = router;