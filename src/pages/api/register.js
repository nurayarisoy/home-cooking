// pages/api/register.js
import { Configuration, OpenAIApi } from "openai"; // OpenAI API import'u
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // API anahtarını al
});
const openai = new OpenAIApi(configuration);

async function openDatabase() {
  return open({
    filename: './database/database.db',
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

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password, latitude, longitude } = req.body;
   

    try {
      const db = await openDatabase();
      await createUsersTable(db);
      await registerUser(db, { username, email, password, latitude, longitude });

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Kullanıcı kaydı: ${username}, Email: ${email}, Lokasyon: (${latitude}, ${longitude})`,
        max_tokens: 100,
      });

      const completion = response.data.choices[0].text;
      res.status(200).json({ message: "Kayıt başarılı", completion });
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      res.status(500).json({ error: "Kayıt işlemi sırasında bir hata oluştu." });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
