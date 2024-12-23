const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database');
const bcrypt = require('bcrypt');

// Tüm kullanıcıları getir (GET /api/users) - Sadece admin görebilmeli
router.get('/', async (req, res) => {
  try {
    const result = await sql.query`SELECT id, username, email, role FROM Users`; // Şifreyi gönderme
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Server Error');
  }
});

// Yeni bir kullanıcı oluştur (POST /api/users)
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Şifreyi hash'le
        const result = await sql.query`INSERT INTO Users (username, email, password, role) VALUES (${username}, ${email}, ${hashedPassword}, ${role})`;
        res.status(201).json({ msg: 'Kullanıcı başarıyla eklendi', insertId: result.insertId }); // Düzeltildi: insertId eklenmesi
    } catch (err) {
        console.error('Error creating user:', err);
    if (err.code === 'EREQUEST' && err.originalError.info.message.includes('Violation of UNIQUE KEY constraint'))
    {
        return res.status(400).json({ msg: 'Kullanıcı adı veya e-posta zaten kullanımda' });
    } else
    {
        res.status(500).send('Server Error');
    }
    }
});

// Belirli bir kullanıcıyı getir (GET /api/users/:id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`SELECT id, username, email, role FROM Users WHERE id = ${id}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).send('Server Error');
  }
});

// Kullanıcıyı güncelle (PUT /api/users/:id)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  try {
      let updateQuery = 'UPDATE Users SET username = @username, email = @email, role = @role';
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

      await request.query(updateQuery);
      res.json({ msg: 'Kullanıcı güncellendi' });
  } catch (err) {
    console.error('Error updating user:', err);
    if (err.code === 'EREQUEST' && err.originalError.info.message.includes('Violation of UNIQUE KEY constraint')) {
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
    // Bu kısım, veritabanı şemanıza göre değişebilir
    await sql.query`DELETE FROM Appointments WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM Users WHERE id = ${id}))`;
    await sql.query`DELETE FROM MedicalRecords WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM Users WHERE id = ${id}))`;
    await sql.query`DELETE FROM Reminders WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM Users WHERE id = ${id}))`;
    await sql.query`DELETE FROM Pets WHERE id IN (SELECT petId FROM Users WHERE id = ${id})`;
    

    // Sonra kullanıcıyı sil
    const result = await sql.query`DELETE FROM Users WHERE id = ${id}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
    res.json({ msg: 'Kullanıcı silindi' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;