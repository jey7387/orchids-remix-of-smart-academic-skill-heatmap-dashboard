const pool = require('./config/db');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create skill_scores table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skill_scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        skill_name VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_skill_scores_user_id ON skill_scores(user_id)');
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
