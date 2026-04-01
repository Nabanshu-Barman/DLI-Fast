const courseRequestsSchema = {
  bsonType: 'object',
  title: 'courserequests',
  additionalProperties: false,
  required: [
    'requestedBy',
    'course',
    'userBalanceAtRequest',
    'status',
    'redemptionCode',
    'adminNote',
    'processedBy',
    'requestedAt',
    'processedAt',
    'createdAt',
    'updatedAt'
  ],
  properties: {
    _id: { bsonType: 'objectId' },
    requestedBy: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['_id', 'name', 'email', 'srmRegNo'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: { bsonType: 'string' },
        email: { bsonType: 'string' },
        srmRegNo: { bsonType: 'string' }
      }
    },
    course: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['_id', 'title', 'pointsRequired'],
      properties: {
        _id: { bsonType: 'objectId' },
        title: { bsonType: 'string' },
        pointsRequired: { bsonType: 'decimal' }
      }
    },
    userBalanceAtRequest: { bsonType: 'decimal' },
    status: { enum: ['pending', 'approved', 'rejected'] },
    redemptionCode: { bsonType: ['string', 'null'] },
    adminNote: { bsonType: ['string', 'null'] },
    processedBy: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['_id', 'name'],
      properties: {
        _id: { bsonType: ['objectId', 'null'] },
        name: { bsonType: ['string', 'null'] }
      }
    },
    requestedAt: { bsonType: 'date' },
    processedAt: { bsonType: ['date', 'null'] },
    createdAt: { bsonType: 'date' },
    updatedAt: { bsonType: 'date' }
  }
};

module.exports = { courseRequestsSchema };
