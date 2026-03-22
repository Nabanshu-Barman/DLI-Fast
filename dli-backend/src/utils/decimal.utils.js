const { Decimal128, ObjectId } = require('mongodb');

/**
 * Converts a numeric value to MongoDB Decimal128
 * @param {number|string|Decimal128} value
 * @returns {Decimal128}
 */
function toDecimal128(value) {
  if (value instanceof Decimal128) return value;
  if (value === null || value === undefined) return Decimal128.fromString('0');
  return Decimal128.fromString(String(value));
}

/**
 * Converts Decimal128 to JavaScript number for JSON responses
 * @param {Decimal128|number|string} value
 * @returns {number}
 */
function toNumber(value) {
  if (value === null || value === undefined) return 0;
  if (value instanceof Decimal128) return parseFloat(value.toString());
  return parseFloat(String(value));
}

/**
 * Converts Decimal128 to string for precise representation
 * @param {Decimal128|number|string} value
 * @returns {string}
 */
function toDecimalString(value) {
  if (value === null || value === undefined) return '0';
  if (value instanceof Decimal128) return value.toString();
  return String(value);
}

/**
 * Adds two Decimal128 values
 * @param {Decimal128|number|string} a
 * @param {Decimal128|number|string} b
 * @returns {Decimal128}
 */
function addDecimals(a, b) {
  const numA = toNumber(a);
  const numB = toNumber(b);
  return toDecimal128(numA + numB);
}

/**
 * Subtracts b from a (a - b)
 * @param {Decimal128|number|string} a
 * @param {Decimal128|number|string} b
 * @returns {Decimal128}
 */
function subtractDecimals(a, b) {
  const numA = toNumber(a);
  const numB = toNumber(b);
  return toDecimal128(numA - numB);
}

/**
 * Multiplies two Decimal128 values
 * @param {Decimal128|number|string} a
 * @param {Decimal128|number|string} b
 * @returns {Decimal128}
 */
function multiplyDecimals(a, b) {
  const numA = toNumber(a);
  const numB = toNumber(b);
  return toDecimal128(numA * numB);
}

/**
 * Compares two Decimal128 values
 * @param {Decimal128|number|string} a
 * @param {Decimal128|number|string} b
 * @returns {number} -1 if a < b, 0 if equal, 1 if a > b
 */
function compareDecimals(a, b) {
  const numA = toNumber(a);
  const numB = toNumber(b);
  if (numA < numB) return -1;
  if (numA > numB) return 1;
  return 0;
}

/**
 * Checks if value is negative
 * @param {Decimal128|number|string} value
 * @returns {boolean}
 */
function isNegative(value) {
  return toNumber(value) < 0;
}

/**
 * Creates a zero Decimal128
 * @returns {Decimal128}
 */
function zeroDecimal() {
  return Decimal128.fromString('0');
}

/**
 * Converts user points subdocument for JSON response
 * @param {Object} points
 * @returns {Object}
 */
function serializePoints(points) {
  if (!points) return null;
  return {
    balance: toNumber(points.balance),
    totalEarned: toNumber(points.totalEarned),
    totalSpent: toNumber(points.totalSpent),
    negativeAccrued: toNumber(points.negativeAccrued)
  };
}

/**
 * Converts task points subdocument for JSON response
 * @param {Object} points
 * @returns {Object}
 */
function serializeTaskPoints(points) {
  if (!points) return null;
  return {
    base: toNumber(points.base),
    multiplier: toNumber(points.multiplier),
    effective: toNumber(points.effective)
  };
}



module.exports = {
  toDecimal128,
  toNumber,
  toDecimalString,
  addDecimals,
  subtractDecimals,
  multiplyDecimals,
  compareDecimals,
  isNegative,
  zeroDecimal,
  serializePoints,
  serializeTaskPoints
};
