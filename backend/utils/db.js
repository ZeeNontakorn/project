const mysql = require('mysql2/promise')

let pool

function parseDatabaseUrl(url) {
  // mysql://user:pass@host:port/dbname
  try {
    const u = new URL(url)
    return {
      host: u.hostname,
      port: u.port,
      user: u.username,
      password: u.password,
      database: u.pathname.replace(/^\//, '')
    }
  } catch (e) {
    return null
  }
}

async function initPool() {
  if (pool) return pool

  // Support either individual env vars or a DATABASE_URL
  let config = {}
  if (process.env.DATABASE_URL) {
    const parsed = parseDatabaseUrl(process.env.DATABASE_URL)
    if (!parsed) throw new Error('Invalid DATABASE_URL')
    config = parsed
  } else {
    config = {
      host: process.env.MYSQL_HOST || process.env.DB_HOST,
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || process.env.DB_USER,
      password: process.env.MYSQL_PASSWORD || process.env.DB_PASS,
      database: process.env.MYSQL_DATABASE || process.env.DB_NAME
    }
  }

  pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })

  return pool
}

async function init() {
  const p = await initPool()
  // Create users table if not exists
  const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `
  await p.query(createUsersTable)
}

module.exports = {
  init,
  getPool: async () => {
    if (!pool) await initPool()
    return pool
  }
}
