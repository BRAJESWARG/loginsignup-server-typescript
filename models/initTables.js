const client = require('../config/db');

async function initTables() {
    await client.query(`
    CREATE TABLE IF NOT EXISTS Credentials (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      encrypted_password VARCHAR(255)
    );
  `);

    await client.query(`
    CREATE TABLE IF NOT EXISTS BmwSales (
      id SERIAL PRIMARY KEY,
      model VARCHAR(100) NOT NULL,
      units_sold INT NOT NULL,
      revenue NUMERIC(12,2) NOT NULL,
      sale_date DATE DEFAULT CURRENT_DATE
    );
  `);

    console.log('✅ Tables verified/created.');
}

module.exports = initTables;
