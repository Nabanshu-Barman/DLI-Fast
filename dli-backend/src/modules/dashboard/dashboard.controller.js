const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');
const { serializeDocument } = require('../../utils/serialize');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getMe(req, res) {
  try {
    const userId = new ObjectId(req.user._id);

    const db = getDB();

    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const requests = await db
      .collection('courserequests')
      .find({ 'requestedBy._id': userId })
      .sort({ requestedAt: -1 })
      .toArray();

    const { passwordHash, ...userWithoutPassword } = user;

    const response = {
      user: userWithoutPassword,
      requests
    };

    res.status(200).json(serializeDocument(response));
  } catch (err) {
    console.error('[Dashboard] getMe error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getMe };
