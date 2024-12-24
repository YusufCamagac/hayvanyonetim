const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: 'Oturum açmanız gerekiyor. (Yetkilendirme başlığı eksik)' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Oturum açmanız gerekiyor. (Token bulunamadı)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Doğrulanan JWT:", decoded); // Decode edilen token'ı konsola yazdırın
    req.user = decoded.user; // Sadece id ve role bilgilerini atayın, decoded.user'ın kendisini değil
    next();
  } catch (err) {
    console.error('Token doğrulama hatası:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Geçersiz token. Lütfen tekrar giriş yapın.' });
    } else {
      return res.status(401).json({ msg: 'Oturum açmanız gerekiyor.' });
    }
  }
};