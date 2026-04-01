const tasksSchema = {
  bsonType: 'object',
  title: 'tasks',
  additionalProperties: false,
  required: [
    'title',
    'description',
    'category',
    'points',
    'isHotBounty',
    'status',
    'priority',
    'difficulty',
    'deadline',
    'tags',
    'projectId',
    'githubIssueRef',
    'createdBy',
    'claimedBy',
    'submissionDetails',
    'transferRequest',
    'completedAt',
    'reviewedBy',
    'penaltyApplied',
    'penaltyPoints',
    'createdAt',
    'updatedAt'
  ],
  properties: {
    _id: { bsonType: 'objectId' },
    title: { bsonType: 'string' },
    description: { bsonType: 'string' },
    category: { enum: ['Frontend', 'ML', 'DevOps', 'Content'] },
    points: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['base', 'multiplier', 'effective'],
      properties: {
        base: { bsonType: 'decimal' },
        multiplier: { bsonType: 'decimal' },
        effective: { bsonType: 'decimal' }
      }
    },
    isHotBounty: { bsonType: 'bool' },
    status: { enum: ['open', 'claimed', 'in_review', 'completed', 'expired'] },
    priority: { enum: ['low', 'medium', 'high', 'critical'] },
    difficulty: { enum: ['beginner', 'intermediate', 'advanced'] },
    deadline: { bsonType: ['date', 'null'] },
    tags: {
      bsonType: 'array',
      items: { bsonType: 'string' }
    },
    projectId: { bsonType: ['objectId', 'null'] },
    githubIssueRef: { bsonType: ['string', 'null'] },
    createdBy: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['_id', 'name', 'srmRegNo'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: { bsonType: 'string' },
        srmRegNo: { bsonType: 'string' }
      }
    },
    claimedBy: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['_id', 'name', 'srmRegNo', 'claimedAt'],
      properties: {
        _id: { bsonType: ['objectId', 'null'] },
        name: { bsonType: ['string', 'null'] },
        srmRegNo: { bsonType: ['string', 'null'] },
        claimedAt: { bsonType: ['date', 'null'] }
      }
    },
    submissionDetails: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['url', 'comment', 'submittedAt'],
      properties: {
        url: { bsonType: ['string', 'null'] },
        comment: { bsonType: ['string', 'null'] },
        submittedAt: { bsonType: ['date', 'null'] }
      }
    },
    transferRequest: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['proposedAssigneeId', 'status'],
      properties: {
        proposedAssigneeId: { bsonType: ['objectId', 'null'] },
        status: { enum: ['pending', 'accepted', 'rejected', null] }
      }
    },
    completedAt: { bsonType: ['date', 'null'] },
    reviewedBy: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['_id', 'name'],
      properties: {
        _id: { bsonType: ['objectId', 'null'] },
        name: { bsonType: ['string', 'null'] }
      }
    },
    penaltyApplied: { bsonType: 'bool' },
    penaltyPoints: { bsonType: 'decimal' },
    createdAt: { bsonType: 'date' },
    updatedAt: { bsonType: 'date' }
  }
};

const projectsSchema = {
  bsonType: 'object',
  title: 'projects',
  additionalProperties: false,
  required: [
    'name',
    'description',
    'repoUrl',
    'lead',
    'members',
    'isActive',
    'createdAt',
    'updatedAt'
  ],
  properties: {
    _id: { bsonType: 'objectId' },
    name: { bsonType: 'string' },
    description: { bsonType: ['string', 'null'] },
    repoUrl: { bsonType: ['string', 'null'] },
    lead: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['_id', 'name', 'srmRegNo'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: { bsonType: 'string' },
        srmRegNo: { bsonType: 'string' }
      }
    },
    members: {
      bsonType: 'array',
      items: {
        bsonType: 'object',
        additionalProperties: false,
        required: ['_id', 'name', 'srmRegNo'],
        properties: {
          _id: { bsonType: 'objectId' },
          name: { bsonType: 'string' },
          srmRegNo: { bsonType: 'string' }
        }
      }
    },
    isActive: { bsonType: 'bool' },
    createdAt: { bsonType: 'date' },
    updatedAt: { bsonType: 'date' }
  }
};

module.exports = { tasksSchema, projectsSchema };
