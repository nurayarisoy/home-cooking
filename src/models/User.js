// src/models/User.js
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export default class User {
    constructor(username, email, password, location) {
        this.username = username;
        this.email = email;
        this.password = password; // Parolayı hash'lemek için güvenlik önlemleri alınmalıdır
        this.location = location;
    }

    // Kullanıcıyı veritabanına kaydetme fonksiyonu
    static async save(user) {
        // SQLite veritabanına bağlantı oluştur
        const db = await open({
            filename: './database/datebase.db',
            driver: sqlite3.Database
        });

        // Kullanıcıyı veritabanına ekle
        await db.run(`
            INSERT INTO users (username, email, password, location)
            VALUES (?, ?, ?, ?)`, [user.username, user.email, user.password, user.location]);

        // Veritabanı bağlantısını kapat
        await db.close();
    }

    // Diğer fonksiyonlar (bulma, güncelleme, silme vb.) buraya eklenebilir
}

  