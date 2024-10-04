const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // body-parser yerine bu kullanılabilir

// SQLite veritabanını oluştur veya bağlan
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Veritabanı açılırken hata:', err.message);
  } else {
    console.log('Veritabanı bağlantısı başarılı.');
  }
});

// Kullanıcılar tablosunu oluştur
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT,
    location TEXT
  )`, (err) => {
    if (err) {
      console.error('Tablo oluşturulurken hata:', err.message);
    } else {
      console.log('Tablo oluşturuldu veya zaten mevcut.');
    }
  });
});

// Kullanıcı kaydetme API'si
app.post('/register', (req, res) => {
  const { username, email, password, location } = req.body;

  db.run(`INSERT INTO users (username, email, password, location) VALUES (?, ?, ?, ?)`, 
    [username, email, password, location], 
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
  });
});

// Giriş API'si
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
    }
    res.status(200).json({ message: "Giriş başarılı!", user: row });
  });
});

// Kullanıcı silme API'si
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }
    res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
  });
});

// Kullanıcı güncelleme API'si
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, location } = req.body;

  db.run(`UPDATE users SET username = ?, email = ?, password = ?, location = ? WHERE id = ?`, 
    [username, email, password, location, id], 
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı." });
      }
      res.status(200).json({ message: "Kullanıcı başarıyla güncellendi." });
  });
});

// Kullanıcı bilgilerini alma API'si
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.json(row);
  });
});

// Kök dizin için bir route ekleyin
app.get('/', (req, res) => {
  res.send('Hoş Geldiniz! Sunucu çalışıyor.');
});

// Sunucuyu başlat
const PORT = 5000; // Port numarasını burada belirtiyoruz
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
