const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../../config/db');
const { JWT_ACCESS_SECRET, TOKEN_EXPIRY } = require('../../config/jwt');
const { serializeDocument } = require('../../utils/serialize');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const db = getDB();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: 'Account is banned' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: 'Account is suspended' });
    }

    const tokenPayload = {
      _id: user._id,
      role: user.role,
      srmRegNo: user.srmRegNo
    };

    const token = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, { expiresIn: TOKEN_EXPIRY });

    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    );

    const { passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      token,
      user: serializeDocument(userWithoutPassword)
    });
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { login };
