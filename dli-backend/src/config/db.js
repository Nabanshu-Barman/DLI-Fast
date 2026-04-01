const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'bounty_board';

let client = null;
let db = null;

/**
 * @returns {Promise<import('mongodb').Db>}
 */
async function connectDB() {
  if (db) return db;

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DATABASE_NAME);

  return db;
}

/**
 * @returns {import('mongodb').Db}
 * @throws {Error} If database not initialized
 */
function getDB() {
  if (!db) throw new Error('Database not initialized. Call connectDB() first.');
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = { connectDB, getDB, closeDB };
