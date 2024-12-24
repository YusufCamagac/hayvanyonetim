import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../config/database.js';
import authenticateToken from '../middleware/authMiddleware.js';

// Randevu Raporu (GET /api/reports/appointments) - Sadece admin
router.get('/appointments', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  const { startDate, endDate, provider, petType } = req.query;

  try {
    const request = new sql.Request();
    let query = `SELECT a.date, a.provider, a.reason, p.name AS petName, p.species AS petSpecies
                 FROM Appointments a
                 JOIN Pets p ON a.petId = p.id`;
    let hasWhereClause = false;

    if (startDate && endDate) {
      query += ` WHERE a.date BETWEEN @startDate AND @endDate`;
      request.input('startDate', sql.DateTime, new Date(startDate));
      request.input('endDate', sql.DateTime, new Date(endDate));
      hasWhereClause = true;
    }

    if (provider) {
      query += hasWhereClause ? ` AND` : ` WHERE`;
      query += ` a.provider = @provider`;
      request.input('provider', sql.VarChar, provider);
      hasWhereClause = true;
    }

    if (petType) {
      query += hasWhereClause ? ` AND` : ` WHERE`;
      query += ` p.species = @petType`;
      request.input('petType', sql.VarChar, petType);
    }
    query += ` ORDER BY a.date`;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Randevu raporu alınırken hata oluştu:', err.message);
    res.status(500).send('Randevu raporu alınırken bir hata oluştu.');
  }
});

// Evcil Hayvan Raporu (GET /api/reports/pets) - Sadece admin
router.get('/pets', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  const { species, gender, minAge, maxAge } = req.query;

  try {
    const request = new sql.Request();
    let query = `SELECT * FROM Pets`;
    let hasWhereClause = false;

    if (species) {
      query += ` WHERE species = @species`;
      request.input('species', sql.VarChar, species);
      hasWhereClause = true;
    }

    if (gender) {
      query += hasWhereClause ? ` AND` : ` WHERE`;
      query += ` gender = @gender`;
      request.input('gender', sql.VarChar, gender);
      hasWhereClause = true;
    }

    if (minAge) {
      query += hasWhereClause ? ` AND` : ` WHERE`;
      query += ` age >= @minAge`;
      request.input('minAge', sql.Int, minAge);
      hasWhereClause = true;
    }

    if (maxAge) {
      query += hasWhereClause ? ` AND` : ` WHERE`;
      query += ` age <= @maxAge`;
      request.input('maxAge', sql.Int, maxAge);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Evcil hayvan raporu alınırken hata oluştu:', err.message);
    res.status(500).send('Evcil hayvan raporu alınırken bir hata oluştu.');
  }
});

// Kullanıcı Raporu (GET /api/reports/users) - Sadece admin
router.get('/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Bu işlemi yapmak için yetkiniz yok.' });
  }

  const { startDate, endDate, role } = req.query;

  try {
    const request = new sql.Request();
    let query = `SELECT id, username, email, role, createdAt FROM Users`; // Şifre bilgisini çekmeyin!
    let hasWhereClause = false;

    if (startDate && endDate) {
      query += ` WHERE createdAt >= @startDate AND createdAt <= @endDate`;
      request.input('startDate', sql.DateTime, new Date(startDate));
      request.input('endDate', sql.DateTime, new Date(endDate));
      hasWhereClause = true;
    }

    if (role) {
      query += hasWhereClause ? ` AND` : ` WHERE`;
      query += ` role = @role`;
      request.input('role', sql.VarChar, role);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Kullanıcı raporu alınırken hata oluştu:', err.message);
    res.status(500).send('Kullanıcı raporu alınırken bir hata oluştu.');
  }
});

export default router;