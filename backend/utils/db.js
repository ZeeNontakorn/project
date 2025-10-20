const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres.railway.internal',
  database: 'railway',
  password: 'NjmovpvRWchLQnuzKnVbygZTIZsRXVYG',
  port: 5432,
});

module.exports = pool;
