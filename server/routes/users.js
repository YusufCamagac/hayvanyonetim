const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database');
const bcrypt = require('bcrypt');

// Tüm kullanıcıları getir (GET /api/users) - Sadece admin görebilmeli
router.get('/', async (req, res) => {
  try {
    const query = `SELECT id, username, email, role FROM Users`; // Şifreyi gönderme
    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Kullanıcı listesi alınırken hata oluştu:', err.message);
    res.status(500).send('Server Error');
  }
});

// Yeni bir kullanıcı oluştur (POST /api/users)
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO Users (username, email, password, role) VALUES (@username, @email, @password, @role)`;
    const request = new sql.Request();
    request.input('username', sql.VarChar, username);
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, hashedPassword);
    request.input('role', sql.VarChar, role);

    const result = await request.query(query);
    res.status(201).json({ msg: 'Kullanıcı başarıyla eklendi' });
  } catch (err) {
    console.error('Kullanıcı eklenirken hata oluştu:', err.message);
    if (
      err.code === 'EREQUEST' &&
      err.originalError.info.message.includes('Violation of UNIQUE KEY constraint')
    ) {
      return res.status(400).json({ msg: 'Bu kullanıcı adı veya e-posta zaten kullanımda' });
    } else {
      res.status(500).send('Server Error');
    }
  }
});

// Belirli bir kullanıcıyı getir (GET /api/users/:id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT id, username, email, role FROM Users WHERE id = @id`;
    const result = await new sql.Request()
      .input('id', sql.Int, id)
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Kullanıcı bilgisi alınırken hata oluştu:', err.message);
    res.status(500).send('Server Error');
  }
});

// Kullanıcıyı güncelle (PUT /api/users/:id)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  try {
    let updateQuery =
      'UPDATE Users SET username = @username, email = @email, role = @role';
    const request = new sql.Request();
    request.input('username', sql.VarChar, username);
    request.input('email', sql.VarChar, email);
    request.input('role', sql.VarChar, role);
    request.input('id', sql.Int, id);

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = @password';
      request.input('password', sql.VarChar, hashedPassword);
    }

    updateQuery += ' WHERE id = @id';

    const result = await request.query(updateQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }

    res.json({ msg: 'Kullanıcı güncellendi' });
  } catch (err) {
    console.error('Kullanıcı güncellenirken hata oluştu:', err.message);
    if (
      err.code === 'EREQUEST' &&
      err.originalError.info.message.includes('Violation of UNIQUE KEY constraint')
    ) {
      return res.status(400).json({ msg: 'Kullanıcı adı veya e-posta zaten kullanımda' });
    } else {
      res.status(500).send('Server Error');
    }
  }
});

// Kullanıcıyı sil (DELETE /api/users/:id)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Önce bağımlı verileri sil (örneğin, randevular, hatırlatıcılar, evcil hayvanlar)
    const deleteAppointmentsQuery = `DELETE FROM Appointments WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM Users WHERE id = @id))`;
    await new sql.Request().input('id', sql.Int, id).query(deleteAppointmentsQuery);

    const deleteMedicalRecordsQuery = `DELETE FROM MedicalRecords WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM Users WHERE id = @id))`;
    await new sql.Request().input('id', sql.Int, id).query(deleteMedicalRecordsQuery);

    const deleteRemindersQuery = `DELETE FROM Reminders WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM Users WHERE id = @id))`;
    await new sql.Request().input('id', sql.Int, id).query(deleteRemindersQuery);
    
    const deletePetsQuery = `DELETE FROM Pets WHERE id IN (SELECT petId FROM Users WHERE id = @id)`;
    await new sql.Request().input('id', sql.Int, id).query(deletePetsQuery);

    // Sonra kullanıcıyı sil
    const query = `DELETE FROM Users WHERE id = @id`;
    const result = await new sql.Request()
      .input('id', sql.Int, id)
      .query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }

    res.json({ msg: 'Kullanıcı silindi' });
  } catch (err) {
    console.error('Kullanıcı silinirken hata oluştu:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;