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
app.use('/api/auth', authRoutes)

// Ensure DB connection and create users table if not exists
;(async () => {
  try {
    await db.init() // will create table if needed
    console.log('Database ready')
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (err) {
    console.error('Failed to initialize DB', err)
    process.exit(1)
  }
})()
