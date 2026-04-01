const express = require('express');
const { validateRequest } = require('../../middleware/validate');
const { getCoursesQuerySchema } = require('./courses.validators');
const { getCourses } = require('./courses.controller');

const router = express.Router();

router.get('/', validateRequest({ query: getCoursesQuerySchema }), getCourses);

module.exports = router;
