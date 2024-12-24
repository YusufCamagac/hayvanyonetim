const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require('mssql'); // mssql paketini import et
const config = require('../config/database'); // config dosyasını import et
require('dotenv').config({ path: '../.env' }); // server klasöründe .env dosyasını kullanmak için

// Kullanıcı Kaydı (POST /api/auth/register)
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Kullanıcı adı veya e-posta zaten var mı kontrol et (tek sorguda)
    const userCheckQuery = `SELECT * FROM Users WHERE username = @username OR email = @email`;
    const userCheckResult = await new sql.Request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .query(userCheckQuery);

    if (userCheckResult.recordset.length > 0) {
      return res.status(400).json({ msg: "Bu kullanıcı adı veya e-posta zaten kullanılıyor." });
    }

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

    // JWT oluştur
    const payload = {
      user: {
        id: userId,
        role: role || 'user',
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        console.log("Oluşturulan JWT:", token); // Token'ı konsola yazdır
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error('Kayıt sırasında hata oluştu:', err.message);
    res.status(500).send("Kayıt sırasında bir hata oluştu.");
  }
});

// Kullanıcı Girişi (POST /api/auth/login)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kullanıcıyı veritabanında ara
    const findUserQuery = `SELECT * FROM Users WHERE username = @username`;
    const findUserResult = await new sql.Request()
      .input('username', sql.VarChar, username)
      .query(findUserQuery);

    const user = findUserResult.recordset[0];

    if (!user) {
      return res.status(400).json({ msg: "Geçersiz kullanıcı adı veya şifre." });
    }

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Geçersiz kullanıcı adı veya şifre." });
    }

    // JWT oluştur
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        console.log("Oluşturulan JWT:", token); // Token'ı konsola yazdır
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Giriş sırasında hata oluştu:', err.message);
    res.status(500).send("Giriş sırasında bir hata oluştu.");
  }
});

module.exports = router;