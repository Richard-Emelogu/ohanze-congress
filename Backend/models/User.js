class User {
  constructor(name, email, password, role = 'admin') {
    this.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = new Date().toISOString();
  }

  static findByEmail(email) {
    try {
      const db = global.db.read();
      return db.users.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static findById(id) {
    try {
      const db = global.db.read();
      return db.users.find(u => u.id === id) || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      return null;
    }
  }

  save() {
    try {
      const db = global.db.read();
      db.users.push({
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
        createdAt: this.createdAt
      });
      global.db.write(db);
      return this;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }
}

module.exports = User;