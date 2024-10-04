// pages/api/register.js
import { Configuration, OpenAIApi } from "openai";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// SQLite veritabanını açan fonksiyon
async function openDatabase() {
  return open({
    filename: './database/database.db', // Veritabanı dosyasının yolu
    driver: sqlite3.Database,
  });
}

// Kullanıcılar tablosunu oluşturma
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

// Kayıt fonksiyonu
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
    console.log('Veritabanı bağlantı hatası:', err.message);
    try {
      const db = await openDatabase();
      await createUsersTable(db); // Kullanıcılar tablosunu oluştur
      await registerUser(db, { username, email, password, latitude, longitude });

      // OpenAI API'ye istek gönder
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Kullanıcı kaydı: ${username}, Email: ${email}, Lokasyon: (${latitude}, ${longitude})`,
        max_tokens: 100,
      });

      const completion = response.data.choices[0].text;

      // Yanıt olarak OpenAI'nin yanıtını döndür
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
