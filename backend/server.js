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
const { poolPromise } = require('./utils/db');
// Ensure DB connection and create users table if not exists
(async () => {
  try {
    const pool = await poolPromise;
    console.log('Database connected!');
    // เริ่ม server ของคุณต่อที่นี่
  } catch (err) {
    console.error('Failed to initialize DB', err);
  }
})();
