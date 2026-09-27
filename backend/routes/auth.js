const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded demo users — replace with DB in production
const USERS = [
  { id: 'admin-001', name: 'Admin User', email: 'admin@swachhsetu.com', password: 'admin123', role: 'admin' },
  { id: 'user-001', name: 'Kunal', email: 'user@swachhsetu.com', password: 'user123', role: 'user', phone: '9876543210' },
];

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user: { id, name, role, phone } }
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role, phone: user.phone || null },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, role: user.role, phone: user.phone || null },
  });
});

module.exports = router;
