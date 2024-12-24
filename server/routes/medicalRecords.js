import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../config/database.js';
import authenticateToken from '../middleware/authMiddleware.js';

// Tüm tıbbi kayıtları getir (GET /api/medical-records)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const request = new sql.Request();
    let query = "";
    if (req.user.role === 'admin') {
        query = `SELECT mr.*, p.name AS petName, p.ownerId AS ownerId FROM MedicalRecords mr JOIN Pets p ON mr.petId = p.id`;
    } else {
        query = `SELECT mr.*, p.name AS petName, p.ownerId AS ownerId FROM MedicalRecords mr JOIN Pets p ON mr.petId = p.id WHERE p.ownerId = @ownerId`;
        request.input('ownerId', sql.Int, req.user.id);
    }
    const result = await request.query(query);
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

    // Tıbbi kaydı oluştur
    const insertQuery = `INSERT INTO MedicalRecords (petId, recordDate, description) VALUES (@petId, @recordDate, @description)`;
    const insertResult = await request
      .input('recordDate', sql.DateTime, recordDate)
      .input('description', sql.VarChar, description)
      .query(insertQuery);

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
    const request = new sql.Request()
      .input('id', sql.Int, id);

    // Kullanıcının yetkisini kontrol et
    let authQuery = `SELECT p.ownerId FROM MedicalRecords mr JOIN Pets p ON mr.petId = p.id WHERE mr.id = @id`;
    const authResult = await request.query(authQuery);

    if (authResult.recordset.length === 0) {
      return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
    }

    const ownerId = authResult.recordset[0].ownerId;

    if (req.user.role !== 'admin' && req.user.id !== ownerId) {
      return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
    }

    // Tıbbi kaydı getir
    const getQuery = `SELECT * FROM MedicalRecords WHERE id = @id`;
    const getResult = await request.query(getQuery);

    res.json(getResult.recordset[0]);
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
    const request = new sql.Request()
      .input('id', sql.Int, id);

    // Kullanıcının yetkisini kontrol et
    let authQuery = `SELECT p.ownerId FROM MedicalRecords mr JOIN Pets p ON mr.petId = p.id WHERE mr.id = @id`;
    const authResult = await request.query(authQuery);

    if (authResult.recordset.length === 0) {
      return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
    }

    const ownerId = authResult.recordset[0].ownerId;

    if (req.user.role !== 'admin' && req.user.id !== ownerId) {
      return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
    }

    // Tıbbi kaydı güncelle
    const updateQuery = `UPDATE MedicalRecords SET petId = @petId, recordDate = @recordDate, description = @description WHERE id = @id`;
    const updateResult = await request
      .input('petId', sql.Int, petId)
      .input('recordDate', sql.DateTime, recordDate)
      .input('description', sql.VarChar, description)
      .query(updateQuery);

    if (updateResult.rowsAffected[0] === 0) {
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
    const request = new sql.Request()
      .input('id', sql.Int, id);

    // Kullanıcının yetkisini kontrol et
    const authQuery = `SELECT p.ownerId FROM MedicalRecords mr JOIN Pets p ON mr.petId = p.id WHERE mr.id = @id`;
    const authResult = await request.query(authQuery);

    if (authResult.recordset.length === 0) {
      return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
    }

    const ownerId = authResult.recordset[0].ownerId;

    if (req.user.role !== 'admin' && req.user.id !== ownerId) {
      return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
    }

    // Tıbbi kaydı sil
    const deleteQuery = `DELETE FROM MedicalRecords WHERE id = @id`;
    const deleteResult = await request.query(deleteQuery);

    if (deleteResult.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: 'Tıbbi kayıt bulunamadı' });
    }

    res.json({ msg: 'Tıbbi kayıt silindi' });
  } catch (err) {
    console.error('Tıbbi kayıt silinirken hata oluştu:', err.message);
    res.status(500).send('Tıbbi kayıt silinirken bir hata oluştu.');
  }
});

export default router;