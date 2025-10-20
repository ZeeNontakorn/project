const db = require('../utils/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d' // adjust as needed

async function register(req, res) {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: 'username and password required' })

  try {
    const pool = await db.getPool()
    // check exists
    const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
    if (rows.length > 0) return res.status(409).json({ message: 'username already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed])
    return res.status(201).json({ id: result.insertId, username })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'internal error' })
  }
}

async function login(req, res) {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: 'username and password required' })

  try {
    const pool = await db.getPool()
    const [rows] = await pool.query('SELECT id, username, password FROM users WHERE username = ?', [username])
    if (rows.length === 0) return res.status(401).json({ message: 'invalid credentials' })

    const user = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'invalid credentials' })

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    return res.json({ token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'internal error' })
  }
}

async function me(req, res) {
  // auth middleware already put user in req.user
  const user = req.user
  return res.json({ id: user.id, username: user.username })
}

module.exports = { register, login, me }
