import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // ES modülü olarak .env yükle

export default function (req, res, next) {
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
    console.log("Doğrulanan JWT:", decoded); // Decode edilen token'ı konsola yazdır
    req.user = {
      id: decoded.user.id,
      role: decoded.user.role
    };
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