require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const db = require('./utils/db')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Health check
app.get('/', (req, res) => res.send('API Server is running'))

// Auth routes
// app.use('/api/auth', authRoutes)
const pool = require('./utils/db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB connected:', res.rows);
  } catch (err) {
    console.error('DB connection failed:', err);
  }
})();
