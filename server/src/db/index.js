const Database = require('better-sqlite3');
const { SCHEMA_SQL } = require('./schema');

let db;

function initDb() {
  if (db) return db;
  db = new Database('app.db');
  db.exec(SCHEMA_SQL);
  return db;
}

function getDb() {
  if (!db) initDb();
  return db;
}

module.exports = { initDb, getDb };
