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
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await sql.query`INSERT INTO Users (username, email, password, role) VALUES (${username}, ${email}, ${hashedPassword}, ${role})`;

        // Generate JWT
        const payload = {
            user: {
                id: result.insertId,
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
        console.error(err.message);
        if (err.code === 'EREQUEST' && err.originalError.info.message.includes('Violation of UNIQUE KEY constraint')) {
            return res.status(400).json({ msg: 'Bu kullanıcı adı veya e-posta zaten kullanımda' });
        } else {
            res.status(500).send("Server Hatası");
        }
    }
});

// Kullanıcı Girişi (POST /api/auth/login)
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const result = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
        const user = result.recordset[0];

        if (!user) {
            return res.status(400).json({ msg: "Geçersiz kullanıcı adı veya şifre" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Geçersiz kullanıcı adı veya şifre" });
        }

        // Generate JWT
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
        console.error(err.message);
        res.status(500).send("Sunucu Hatası");
    }
});

module.exports = router;