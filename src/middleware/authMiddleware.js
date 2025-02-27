import jwt from 'jsonwebtoken'; // gebruik 'import' in plaats van 'require'
const SECRET_KEY = process.env.JWT_SECRET || 'geheime_sleutel';

// ✅ Middleware om JWT te controleren
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Geen toegang, token ontbreekt' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Opslaan van de ingelogde gebruiker
    next();
  } catch (error) {
    res.status(401).json({ message: 'Ongeldige token' });
  }
};

export default authMiddleware; // gebruik 'export default' in plaats van 'module.exports'
