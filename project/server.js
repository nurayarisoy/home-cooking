const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

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
// Kullanıcı bilgilerini alma API'si
// Kullanıcı güncelleme API'si
// Kullanıcı silme API'si
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

// Kök dizin için bir route ekleyin
app.get('/', (req, res) => {
  res.send('Hoş Geldiniz! Sunucu çalışıyor.');
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
