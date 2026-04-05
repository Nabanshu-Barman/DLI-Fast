const express = require('express');
const { validateRequest } = require('../../middleware/validate');
const { verifyToken, requireAdmin } = require('../../middleware/auth.middleware');
const {
  courseIdParamSchema,
  bulkUploadCodesBodySchema,
  getCodesListQuerySchema
} = require('./dli-codes.validators');
const {
  bulkUploadCodes,
  getAvailableCodesCount,
  getCourseCodesList
} = require('./dli-codes.controller');

const router = express.Router({ mergeParams: true });

// Bulk upload DLI codes (Admin only)
router.post(
  '/bulk-upload',
  verifyToken,
  requireAdmin,
  validateRequest({ body: bulkUploadCodesBodySchema }),
  bulkUploadCodes
);

// Get available codes count for a course (Public)
router.get(
  '/available-count',
  getAvailableCodesCount
);

// Get all codes for a course (Admin only)
router.get(
  '/list',
  verifyToken,
  requireAdmin,
  validateRequest({ query: getCodesListQuerySchema }),
  getCourseCodesList
);

module.exports = router;
