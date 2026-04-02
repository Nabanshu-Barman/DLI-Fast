const { getDB } = require('../../config/db');
const { serializeDocument } = require('../../utils/serialize');
const { ObjectId } = require('mongodb');

/**
 * Bulk upload DLI codes for a course
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function bulkUploadCodes(req, res) {
  try {
    const { courseId } = req.params;
    const { codes } = req.body;

    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    if (!Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({ error: 'Codes must be a non-empty array' });
    }

    const db = getDB();
    const courseObjectId = new ObjectId(courseId);
    const now = new Date();

    // Verify course exists
    const course = await db.collection('courses').findOne({ _id: courseObjectId });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Prepare DLI codes documents
    const dliCodesDocuments = codes.map((code) => ({
      courseId: courseObjectId,
      code: code.trim(),
      isUsed: false,
      usedBy: null,
      usedAt: null,
      createdAt: now
    }));

    // Insert all codes in bulk
    const result = await db.collection('dli_codes').insertMany(dliCodesDocuments);

    // Update course inventory count
    const addedCodesCount = result.insertedIds.length;
    await db.collection('courses').updateOne(
      { _id: courseObjectId },
      {
        $inc: { inventoryCount: addedCodesCount },
        $set: { updatedAt: now }
      }
    );

    res.status(201).json({
      message: 'DLI codes uploaded successfully',
      uploadedCount: addedCodesCount,
      courseId,
      updatedInventoryCount: course.inventoryCount + addedCodesCount
    });
  } catch (err) {
    console.error('[DLI Codes] bulkUploadCodes error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get available DLI codes count for a specific course
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
    console.error('[DLI Codes] getAvailableCodesCount error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all DLI codes for a course (Admin only - for management)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getCourseCodesList(req, res) {
  try {
    const { courseId } = req.params;
    const { used, limit = 100, skip = 0 } = req.query;

    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const db = getDB();
    const query = { courseId: new ObjectId(courseId) };

    if (used !== undefined) {
      query.isUsed = used === 'true';
    }

    const codes = await db
      .collection('dli_codes')
      .find(query)
      .limit(Math.min(parseInt(limit), 500))
      .skip(parseInt(skip))
      .toArray();

    const totalCount = await db.collection('dli_codes').countDocuments(query);

    res.status(200).json({
      courseId,
      codes: codes.map(serializeDocument),
      pagination: {
        total: totalCount,
        limit: Math.min(parseInt(limit), 500),
        skip: parseInt(skip)
      }
    });
  } catch (err) {
    console.error('[DLI Codes] getCourseCodesList error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  bulkUploadCodes,
  getAvailableCodesCount,
  getCourseCodesList
};
