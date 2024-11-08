// pages/api/register.js

import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Eğer bu hatayı alıyorsanız, OpenAI API ayarlarını doğrudan OpenAIApi'ye geçirin
const openai = new OpenAIApi({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // API anahtarını al
});

async function openDatabase() {
  return open({
    filename: "./database/database.db",
    driver: sqlite3.Database,
  });
}

async function createUsersTable(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      latitude REAL,
      longitude REAL
    )
  `);
}

async function registerUser(db, user) {
  const { username, email, password, latitude, longitude } = user;
  await db.run(`
    INSERT INTO users (username, email, password, latitude, longitude)
    VALUES (?, ?, ?, ?, ?)
  `, [username, email, password, latitude, longitude]);
}

// pages/api/register.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, password, latitude, longitude } = req.body;

    try {
      // OpenAI API çağrısı örneği
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Hello World",
        max_tokens: 5,
      });

      // Veritabanı işlemleri
      const db = await openDatabase();
      await createUsersTable(db);
      await registerUser(db, { username, email, password, latitude, longitude });
      await db.close();

      res.status(200).json({ message: "User registered successfully", data: response.data });
    } catch (error) {
      console.error("OpenAI API Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
