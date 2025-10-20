const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'turntable.proxy.rlwy.net',  // ✅ เปลี่ยนมาใช้ External Host
  database: 'railway',
  password: 'NjmovpvRWchLQnuzKnVbygZTIZsRXVYG',
  port: 50573,  // ✅ ใช้ External Port
});

module.exports = pool;
