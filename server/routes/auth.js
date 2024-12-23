const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require('mssql');
const config = require('../config/database');

// Kullanıcı Kaydı (POST /api/auth/register)
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Kullanıcı adı veya e-posta zaten var mı kontrol et
        let query = `SELECT * FROM Users WHERE username = @username OR email = @email`;
        let result = await new sql.Request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .query(query);

        if (result.recordset.length > 0) {
            return res.status(400).json({ msg: "Bu kullanıcı adı veya e-posta zaten kullanılıyor." });
        }

        // Şifreyi bcrypt ile hash'le
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yeni kullanıcıyı veritabanına ekle
        query = `INSERT INTO Users (username, email, password, role) VALUES (@username, @email, @password, @role); SELECT SCOPE_IDENTITY() AS id;`;
        result = await new sql.Request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .input('role', sql.VarChar, role)
            .query(query);

        // Eklenen kullanıcının ID'sini al
        const userId = result.recordset[0].id;

        // JWT oluştur
        const payload = {
            user: {
                id: userId,
                role: role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        console.error('Kayıt sırasında hata oluştu:', err.message);
        res.status(500).send("Sunucu Hatası");
    }
});

// Kullanıcı Girişi (POST /api/auth/login)
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kullanıcıyı veritabanında ara
        const query = `SELECT * FROM Users WHERE username = @username`;
        const result = await new sql.Request()
            .input('username', sql.VarChar, username)
            .query(query);

        const user = result.recordset[0];

        if (!user) {
            return res.status(400).json({ msg: "Geçersiz kullanıcı adı veya şifre" });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Geçersiz kullanıcı adı veya şifre" });
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
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Giriş sırasında hata oluştu:', err.message);
        res.status(500).send("Sunucu Hatası");
    }
});

module.exports = router;