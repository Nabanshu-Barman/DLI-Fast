const { getDB } = require('../../config/db');
const { serializeDocument } = require('../../utils/serialize');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getCourses(req, res) {
  try {
    const { category, level } = req.query;

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    const db = getDB();
    const courses = await db
      .collection('courses')
      .find(query)
      .sort({ pointsRequired: 1 })
      .toArray();

    res.status(200).json({
      courses: courses.map(serializeDocument)
    });
  } catch (err) {
    console.error('[Courses] getCourses error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getCourses };
