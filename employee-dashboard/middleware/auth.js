// Simple JWT auth middleware placeholder
// Usage: const auth = require('./middleware/auth'); app.use('/api/protected', auth, (req,res)=>{...})

const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = header.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = decoded; // { id, role, ... }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
