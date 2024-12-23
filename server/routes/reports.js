const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config/database');
const authenticateToken = require('../middleware/authMiddleware'); // JWT doğrulaması için middleware

// Randevu Raporu (GET /api/reports/appointments) - Sadece admin
router.get('/appointments', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  const { startDate, endDate, provider, petType } = req.query;

  try {
    let query = `SELECT a.date, a.provider, a.reason, p.name AS petName, p.species AS petSpecies
                 FROM Appointments a
                 JOIN Pets p ON a.petId = p.id`;
    const request = new sql.Request();

    if (startDate && endDate) {
      query += ` WHERE a.date BETWEEN @startDate AND @endDate`;
      request.input('startDate', sql.DateTime, new Date(startDate));
      request.input('endDate', sql.DateTime, new Date(endDate));
    }

    if (provider) {
      query += startDate && endDate ? ` AND` : ` WHERE`;
      query += ` a.provider = @provider`;
      request.input('provider', sql.VarChar, provider);
    }

    if (petType) {
      query += startDate && endDate || provider ? ` AND` : ` WHERE`;
      query += ` p.species = @petType`;
      request.input('petType', sql.VarChar, petType);
    }
    query += ` ORDER BY a.date`;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Randevu raporu alınırken hata oluştu:', err.message);
    res.status(500).send('Server Error');
  }
});

// Evcil Hayvan Raporu (GET /api/reports/pets) - Sadece admin
router.get('/pets', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  const { species, gender, minAge, maxAge } = req.query;

  try {
    let query = `SELECT * FROM Pets`;
    const request = new sql.Request();

    if (species) {
      query += ` WHERE species = @species`;
      request.input('species', sql.VarChar, species);
    }

    if (gender) {
      query += species ? ` AND` : ` WHERE`;
      query += ` gender = @gender`;
      request.input('gender', sql.VarChar, gender);
    }

    if (minAge) {
      query += species || gender ? ` AND` : ` WHERE`;
      query += ` age >= @minAge`;
      request.input('minAge', sql.Int, minAge);
    }

    if (maxAge) {
      query += species || gender || minAge ? ` AND` : ` WHERE`;
      query += ` age <= @maxAge`;
      request.input('maxAge', sql.Int, maxAge);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Evcil hayvan raporu alınırken hata oluştu:', err.message);
    res.status(500).send('Server Error');
  }
});

// Kullanıcı Raporu (GET /api/reports/users) - Sadece admin
router.get('/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  const { startDate, endDate, role } = req.query;

  try {
    let query = `SELECT id, username, email, role FROM Users`; // Şifre bilgisini çekmeyin!
    const request = new sql.Request();

    if (startDate && endDate) {
      query += ` WHERE createdAt BETWEEN @startDate AND @endDate`; // Kullanıcı tablosunda createdAt sütunu olduğunu varsayıyorum.
      request.input('startDate', sql.DateTime, new Date(startDate));
      request.input('endDate', sql.DateTime, new Date(endDate));
    }

    if (role) {
      query += startDate && endDate ? ` AND` : ` WHERE`;
      query += ` role = @role`;
      request.input('role', sql.VarChar, role);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Kullanıcı raporu alınırken hata oluştu:', err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router;