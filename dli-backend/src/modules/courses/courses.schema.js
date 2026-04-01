const coursesSchema = {
  bsonType: 'object',
  title: 'courses',
  additionalProperties: false,
  required: [
    'title',
    'description',
    'pointsRequired',
    'imageUrl',
    'category',
    'level',
    'provider',
    'inventoryCount',
    'isActive',
    'createdAt',
    'updatedAt'
  ],
  properties: {
    _id: { bsonType: 'objectId' },
    title: { bsonType: 'string' },
    description: { bsonType: 'string' },
    pointsRequired: { bsonType: 'decimal' },
    imageUrl: { bsonType: 'string' },
    category: { bsonType: 'string' },
    level: { enum: ['Beginner', 'Intermediate', 'Advanced'] },
    provider: { bsonType: 'string' },
    inventoryCount: { bsonType: 'number' },
    isActive: { bsonType: 'bool' },
    createdAt: { bsonType: 'date' },
    updatedAt: { bsonType: 'date' }
  }
};

const dliCodesSchema = {
  bsonType: 'object',
  title: 'dli_codes',
  additionalProperties: false,
  required: ['courseId', 'code', 'isUsed', 'usedBy', 'usedAt', 'createdAt'],
  properties: {
    _id: { bsonType: 'objectId' },
    courseId: { bsonType: 'objectId' },
    code: { bsonType: 'string' },
    isUsed: { bsonType: 'bool' },
    usedBy: { bsonType: ['objectId', 'null'] },
    usedAt: { bsonType: ['date', 'null'] },
    createdAt: { bsonType: 'date' }
  }
};

module.exports = { coursesSchema, dliCodesSchema };
