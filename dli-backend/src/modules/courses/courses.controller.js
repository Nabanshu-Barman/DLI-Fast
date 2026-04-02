const { getDB } = require('../../config/db');
const { serializeDocument } = require('../../utils/serialize');
const { ObjectId, Decimal128 } = require('mongodb');
const { toDecimal128, toNumber } = require('../../utils/decimal.utils');

/**
 * Get courses catalog with filtering
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

/**
 * Create a new course (Admin only)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createCourse(req, res) {
  try {
    const { title, description, pointsRequired, imageUrl, category, level, provider } = req.body;

    const db = getDB();
    const now = new Date();

    const newCourse = {
      title,
      description,
      pointsRequired: toDecimal128(pointsRequired),
      imageUrl,
      category,
      level,
      provider,
      inventoryCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection('courses').insertOne(newCourse);

    res.status(201).json({
      message: 'Course created successfully',
      course: serializeDocument({ _id: result.insertedId, ...newCourse })
    });
  } catch (err) {
    console.error('[Courses] createCourse error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update a course (Admin only)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateCourse(req, res) {
  try {
    const { courseId } = req.params;
    const { title, description, pointsRequired, imageUrl, category, level, provider, isActive } = req.body;

    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const db = getDB();
    const now = new Date();

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (pointsRequired !== undefined) updateData.pointsRequired = toDecimal128(pointsRequired);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (level !== undefined) updateData.level = level;
    if (provider !== undefined) updateData.provider = provider;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = now;

    const result = await db.collection('courses').findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course: serializeDocument(result.value)
    });
  } catch (err) {
    console.error('[Courses] updateCourse error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete a course (Admin only)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteCourse(req, res) {
  try {
    const { courseId } = req.params;

    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const db = getDB();

    const result = await db.collection('courses').deleteOne({
      _id: new ObjectId(courseId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course deleted successfully'
    });
  } catch (err) {
    console.error('[Courses] deleteCourse error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get available DLI codes count for a course
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getAvailableCodesCount(req, res) {
  try {
    const { courseId } = req.params;

    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const db = getDB();

    const count = await db.collection('dli_codes').countDocuments({
      courseId: new ObjectId(courseId),
      isUsed: false
    });

    res.status(200).json({
      courseId,
      availableCodesCount: count
    });
  } catch (err) {
    console.error('[Courses] getAvailableCodesCount error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAvailableCodesCount
};
