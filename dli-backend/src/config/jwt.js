const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-secret-change-in-production';
const TOKEN_EXPIRY = '24h';

module.exports = { JWT_ACCESS_SECRET, TOKEN_EXPIRY };
