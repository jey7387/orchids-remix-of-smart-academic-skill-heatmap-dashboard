const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  try {
    // Clean up existing users table if it exists and recreate
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    await pool.query('DROP TABLE IF EXISTS skill_scores CASCADE');
    
    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create skill_scores table
    await pool.query(`
      CREATE TABLE skill_scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        skill_name VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sample users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const facultyPassword = await bcrypt.hash('faculty123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    await pool.query(`
      INSERT INTO users (name, email, password, role) VALUES
        ('Admin User', 'admin@academic.com', $1, 'admin'),
        ('Faculty User', 'faculty@academic.com', $2, 'faculty'),
        ('Student User', 'student@academic.com', $3, 'student'),
        ('John Student', 'john@student.com', $3, 'student'),
        ('Jane Student', 'jane@student.com', $3, 'student')
    `, [adminPassword, facultyPassword, studentPassword]);

    console.log('Database setup completed successfully!');
    console.log('Sample users created:');
    console.log('- Admin: admin@academic.com / admin123');
    console.log('- Faculty: faculty@academic.com / faculty123');
    console.log('- Student: student@academic.com / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
