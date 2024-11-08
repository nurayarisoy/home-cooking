// lib/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './mydb.sqlite', // Veritabanı dosyanızın adı
    driver: sqlite3.Database,
  });
}
