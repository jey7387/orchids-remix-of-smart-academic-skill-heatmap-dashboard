const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const studentRoutes = require('./routes/students');
const studentProfileRoutes = require('./routes/studentProfile');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', skillRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/student', studentProfileRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ db: 'connected', result });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/test-env', (req, res) => {
  res.json({ 
    node_env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL ? 'set' : 'not set',
    jwt_secret: process.env.JWT_SECRET ? 'set' : 'not set',
    frontend_url: process.env.FRONTEND_URL || 'not set'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
