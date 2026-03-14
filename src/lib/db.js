import fs from "node:fs";
import path from "node:path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

let dbPromise;

async function columnExists(db, tableName, columnName) {
  const columns = await db.all(`PRAGMA table_info(${tableName})`);
  return columns.some((column) => column.name === columnName);
}

async function ensureColumn(db, tableName, columnName, definition) {
  const exists = await columnExists(db, tableName, columnName);
  if (!exists) {
    await db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function initializeDatabase(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      location_lat REAL,
      location_lng REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      media_name TEXT,
      author_email TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Backward-compatible schema evolution for recipe editor features.
  await ensureColumn(db, "recipes", "ingredients_text", "TEXT");
  await ensureColumn(db, "recipes", "instructions_text", "TEXT");
  await ensureColumn(db, "recipes", "media_url", "TEXT");
  await ensureColumn(db, "recipes", "media_type", "TEXT");
  await ensureColumn(db, "recipes", "published", "INTEGER DEFAULT 0");
}

export async function getDb() {
  if (!dbPromise) {
    const databaseDir = path.join(process.cwd(), "database");
    fs.mkdirSync(databaseDir, { recursive: true });

    const databasePath = path.join(databaseDir, "database.db");

    dbPromise = open({
      filename: databasePath,
      driver: sqlite3.Database,
    }).then(async (db) => {
      await initializeDatabase(db);
      return db;
    });
  }

  return dbPromise;
}
