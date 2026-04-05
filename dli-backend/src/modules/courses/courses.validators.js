const { z } = require('zod');

const getCoursesQuerySchema = z.object({
  category: z.string().trim().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional()
}).strict();

const createCourseBodySchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  pointsRequired: z.number().positive('Points required must be positive'),
  imageUrl: z.string().url('Invalid image URL'),
  category: z.string().min(1, 'Category is required').trim(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced'], { errorMap: () => ({ message: 'Invalid level' }) }),
  provider: z.string().min(1, 'Provider is required').trim()
}).strict();

const updateCourseBodySchema = z.object({
  title: z.string().min(1).trim().optional(),
  description: z.string().min(1).trim().optional(),
  pointsRequired: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  category: z.string().min(1).trim().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  provider: z.string().min(1).trim().optional(),
  isActive: z.boolean().optional()
}).strict();

const courseIdParamSchema = z.object({
  courseId: z.string().regex(/^[0-9a-f]{24}$/, 'Invalid course ID format')
}).strict();

module.exports = {
  getCoursesQuerySchema,
  createCourseBodySchema,
  updateCourseBodySchema,
  courseIdParamSchema
};
