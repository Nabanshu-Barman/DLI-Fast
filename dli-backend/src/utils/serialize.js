const { Decimal128, ObjectId } = require('mongodb');

/**
 * Recursively converts all Decimal128, Date, and ObjectId fields in an object to numbers/strings
 * @param {Object} obj
 * @returns {Object}
 */
function serializeDocument(obj) {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof ObjectId || obj._bsontype === 'ObjectID') return obj.toString();
  if (obj instanceof Date) return obj.toISOString();
  if (obj instanceof Decimal128) return parseFloat(obj.toString());

  if (Array.isArray(obj)) return obj.map(serializeDocument);

  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = serializeDocument(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

module.exports = {
  serializeDocument
};
