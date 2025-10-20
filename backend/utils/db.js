const sql = require('mssql');

const config = {
  user: 'nontakorn',
  password: 'zeeza2006',
  server: 'DESKTOP-KE76UMA\\SQLEXPRESS',
  database: 'TEST-DEPOLY',
  options: {
    encrypt: false,        // สำหรับ local SQL Server
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = {
  sql, poolPromise
};
