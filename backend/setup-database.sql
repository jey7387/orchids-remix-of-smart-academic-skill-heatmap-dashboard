-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create skill_scores table for student progress tracking
CREATE TABLE IF NOT EXISTS skill_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_skill_scores_user_id ON skill_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_scores_skill_name ON skill_scores(skill_name);
