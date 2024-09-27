// src/models/User.js

export default class User {
    constructor(username, email, password, location) {
      this.username = username;
      this.email = email;
      this.password = password;
      this.location = location;
    }
    
    // Kullanıcıyı veritabanına kaydetme fonksiyonu
    static async save(user) {
      // SQLite veritabanına kullanıcıyı ekleyecek kodu buraya yaz
    }
    
    // Diğer fonksiyonlar (bulma, güncelleme, silme vb.) buraya eklenebilir
  }
  