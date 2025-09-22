const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register',
  body('name').isString().notEmpty(),
  body('email').isString().notEmpty(),
  body('password').isLength({ min: 8 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      console.log("🚀 ~ errors:", errors)
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { name, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'User exists' });
      const hashed = await bcrypt.hash(password, 10);
      const u = new User({ name, email, password: hashed });
      await u.save();
      res.json({ ok: true, userId: u._id });
    } catch (err) { next(err); }
  });

router.post('/login',
  body('email').isString().notEmpty(),
  body('password').isString().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ sub: String(user._id), name:user.name, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
      console.log("🚀 ~ token:", token, user)
      res.json({ access_token: token, token_type: 'Bearer', expires_in: process.env.JWT_EXPIRES_IN || '1h' });
    } catch (err) { next(err); }
  });

module.exports = router;
