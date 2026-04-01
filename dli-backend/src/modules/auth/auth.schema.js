const usersSchema = {
  bsonType: 'object',
  title: 'users',
  additionalProperties: false,
  required: [
    'srmRegNo',
    'name',
    'email',
    'passwordHash',
    'avatarUrl',
    'role',
    'subRoles',
    'points',
    'activeCourse',
    'rank',
    'coursesCompletedCount',
    'isBanned',
    'isSuspended',
    'lastLoginAt',
    'githubUsername',
    'notificationPrefs',
    'createdAt',
    'updatedAt'
  ],
  properties: {
    _id: { bsonType: 'objectId' },
    srmRegNo: { bsonType: 'string' },
    name: { bsonType: 'string' },
    email: { bsonType: 'string' },
    passwordHash: { bsonType: 'string' },
    avatarUrl: { bsonType: ['string', 'null'] },
    role: { enum: ['member', 'admin'] },
    subRoles: {
      bsonType: 'array',
      items: {
        bsonType: 'object',
        additionalProperties: false,
        required: ['projectId', 'role'],
        properties: {
          projectId: { bsonType: 'objectId' },
          role: { enum: ['project_lead', 'mentor'] }
        }
      }
    },
    points: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['balance', 'totalEarned', 'totalSpent', 'negativeAccrued'],
      properties: {
        balance: { bsonType: 'decimal' },
        totalEarned: { bsonType: 'decimal' },
        totalSpent: { bsonType: 'decimal' },
        negativeAccrued: { bsonType: 'decimal' }
      }
    },
    activeCourse: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['_id', 'title', 'pointsRequired'],
      properties: {
        _id: { bsonType: ['objectId', 'null'] },
        title: { bsonType: ['string', 'null'] },
        pointsRequired: { bsonType: ['decimal', 'null'] }
      }
    },
    rank: { enum: ['Rookie', 'Contributor', 'Expert', 'Elite'] },
    coursesCompletedCount: { bsonType: 'number' },
    isBanned: { bsonType: 'bool' },
    isSuspended: { bsonType: 'bool' },
    lastLoginAt: { bsonType: 'date' },
    githubUsername: { bsonType: ['string', 'null'] },
    notificationPrefs: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['email', 'discord', 'slack'],
      properties: {
        email: { bsonType: 'bool' },
        discord: { bsonType: 'bool' },
        slack: { bsonType: 'bool' }
      }
    },
    createdAt: { bsonType: 'date' },
    updatedAt: { bsonType: 'date' }
  }
};

module.exports = { usersSchema };
