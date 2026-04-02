const { z } = require('zod');

const courseIdParamSchema = z.object({
  courseId: z.string().regex(/^[0-9a-f]{24}$/, 'Invalid course ID format')
}).strict();

const bulkUploadCodesBodySchema = z.object({
  codes: z
    .array(z.string().trim().min(1, 'Code cannot be empty'))
    .min(1, 'At least one code is required')
    .max(10000, 'Maximum 10000 codes per upload')
}).strict();

const getCodesListQuerySchema = z.object({
  used: z.enum(['true', 'false']).optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional().default('100'),
  skip: z.string().regex(/^\d+$/, 'Skip must be a number').optional().default('0')
}).strict();

module.exports = {
  courseIdParamSchema,
  bulkUploadCodesBodySchema,
  getCodesListQuerySchema
};
