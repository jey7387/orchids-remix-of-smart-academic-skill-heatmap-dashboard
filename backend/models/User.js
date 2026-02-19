const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, role } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (name, email, password, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, name, email, role, created_at
    `;
    
    const result = await pool.query(query, [name, email, hashedPassword, role]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, role, year, semester, department, roll_number, batch, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAll() {
    const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = User;
