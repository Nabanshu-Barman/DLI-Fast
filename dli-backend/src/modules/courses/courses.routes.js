const express = require('express');
const { validateRequest } = require('../../middleware/validate');
const { verifyToken, requireAdmin } = require('../../middleware/auth.middleware');
const {
  getCoursesQuerySchema,
  createCourseBodySchema,
  updateCourseBodySchema,
  courseIdParamSchema
} = require('./courses.validators');
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAvailableCodesCount
} = require('./courses.controller');
const dliCodesRoutes = require('./dli-codes.routes');

const router = express.Router();

// Public routes
router.get('/', validateRequest({ query: getCoursesQuerySchema }), getCourses);

// Protected routes (Admin only)
router.post(
  '/',
  verifyToken,
  requireAdmin,
  validateRequest({ body: createCourseBodySchema }),
  createCourse
);

router.patch(
  '/:courseId',
  verifyToken,
  requireAdmin,
  validateRequest({ params: courseIdParamSchema, body: updateCourseBodySchema }),
  updateCourse
);

router.delete(
  '/:courseId',
  verifyToken,
  requireAdmin,
  validateRequest({ params: courseIdParamSchema }),
  deleteCourse
);

// Available codes count
router.get(
  '/:courseId/available-codes',
  validateRequest({ params: courseIdParamSchema }),
  getAvailableCodesCount
);

// DLI Codes nested routes
router.use('/:courseId/codes', dliCodesRoutes);

module.exports = router;
