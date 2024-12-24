import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../config/database.js';
import bcrypt from 'bcrypt';
import authenticateToken from '../middleware/authMiddleware.js';

// Tüm kullanıcıları getir (GET /api/users) - Sadece admin görebilmeli
router.get('/', authenticateToken, async (req, res) => {
  // Sadece admin yetkisi olanlar erişebilsin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  try {
    const result = await new sql.Request().query("SELECT id, username, email, role, createdAt FROM Users");
    res.json(result.recordset);
  } catch (err) {
    console.error('Kullanıcı listesi alınırken hata oluştu:', err.message);
    res.status(500).send('Kullanıcı listesi alınırken bir hata oluştu.');
  }
});

// Yeni bir kullanıcı oluştur (POST /api/users)
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
      // Şifreyi hash'le
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Yeni kullanıcıyı veritabanına ekle
      const insertUserQuery = `INSERT INTO Users (username, email, password, role) VALUES (@username, @email, @password, @role); SELECT SCOPE_IDENTITY() AS id;`;
      const insertUserResult = await new sql.Request()
          .input('username', sql.VarChar, username)
          .input('email', sql.VarChar, email)
          .input('password', sql.VarChar, hashedPassword)
          .input('role', sql.VarChar, role || 'user') // Rol belirtilmemişse varsayılan olarak 'user' ata
          .query(insertUserQuery);

      // Eklenen kullanıcının ID'sini al
      const userId = insertUserResult.recordset[0].id;

      res.status(201).json({ msg: 'Kullanıcı başarıyla eklendi', userId: userId });
  } catch (err) {
      console.error('Kullanıcı eklenirken hata oluştu:', err.message);
      if (err.code === 'EREQUEST' && err.originalError.info.message.includes('Violation of UNIQUE KEY constraint')) {
          return res.status(400).json({ msg: 'Kullanıcı adı veya e-posta zaten kullanımda' });
      } else {
          res.status(500).send('Kullanıcı eklenirken bir hata oluştu.');
      }
  }
});

// Belirli bir kullanıcıyı getir (GET /api/users/:id)
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  // Kullanıcı sadece kendi bilgilerini görebilir, admin ise herkesi görebilir.
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  try {
    const result = await new sql.Request()
      .input('id', sql.Int, id)
      .query("SELECT id, username, email, role, createdAt FROM Users WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Kullanıcı bilgisi alınırken hata oluştu:', err.message);
    res.status(500).send('Kullanıcı bilgisi alınırken bir hata oluştu.');
  }
});

// Kullanıcıyı güncelle (PUT /api/users/:id)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  // Kullanıcı sadece kendi bilgilerini veya admin ise herkesin bilgilerini güncelleyebilir
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  try {
      let updateQuery = 'UPDATE Users SET username = @username, email = @email';
      const request = new sql.Request()
          .input('username', sql.VarChar, username)
          .input('email', sql.VarChar, email)
          .input('id', sql.Int, id);

      // Admin, kullanıcı rolünü güncelleyebilir
      if (req.user.role === 'admin' && role) {
          updateQuery += ', role = @role';
          request.input('role', sql.VarChar, role);
      }

      // Şifre güncellemesi (isteğe bağlı)
      if (password) {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
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
      if (err.code === 'EREQUEST' && err.originalError.info.message.includes('Violation of UNIQUE KEY constraint')) {
          return res.status(400).json({ msg: 'Kullanıcı adı veya e-posta zaten kullanımda' });
      } else {
          res.status(500).send('Kullanıcı güncellenirken bir hata oluştu.');
      }
  }
});

// Kullanıcıyı sil (DELETE /api/users/:id) - Sadece admin
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  // Sadece admin yetkisi olanlar kullanıcı silebilir
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  try {
      // Önce bağımlı verileri sil (randevular, hatırlatıcılar, tıbbi kayıtlar ve evcil hayvanlar)
      await sql.query`DELETE FROM Appointments WHERE petId IN (SELECT id FROM Pets WHERE ownerId = ${id})`;
      await sql.query`DELETE FROM MedicalRecords WHERE petId IN (SELECT id FROM Pets WHERE ownerId = ${id})`;
      await sql.query`DELETE FROM Reminders WHERE petId IN (SELECT id FROM Pets WHERE ownerId = ${id})`;
      await sql.query`DELETE FROM Medications WHERE petId IN (SELECT id FROM Pets WHERE ownerId = ${id})`;
      await sql.query`DELETE FROM Pets WHERE ownerId = ${id}`;

      // Sonra kullanıcıyı sil
      const deleteUserResult = await new sql.Request()
          .input('id', sql.Int, id)
          .query("DELETE FROM Users WHERE id = @id");

      if (deleteUserResult.rowsAffected[0] === 0) {
          return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
      }

      res.json({ msg: 'Kullanıcı silindi' });
  } catch (err) {
      console.error('Kullanıcı silinirken hata oluştu:', err.message);
      res.status(500).send('Kullanıcı silinirken bir hata oluştu.');
  }
});

export default router;