// src/lib/db.js

const sqlite3 = require('sqlite3').verbose();

let db;

export default function dbConnect() {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }
    
    db = new sqlite3.Database('./database.db', (err) => {
      if (err) {
        return reject(err);
      }
      resolve(db);
    });
  });
}
