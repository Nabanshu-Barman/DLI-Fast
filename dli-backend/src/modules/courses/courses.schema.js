const { z } = require('zod');

const getCoursesQuerySchema = z.object({
  category: z.string().trim().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional()
}).strict();

module.exports = { getCoursesQuerySchema };
