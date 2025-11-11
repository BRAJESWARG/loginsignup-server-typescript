const pool = require('../config/db');

// Create table if not exists
(async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS bmw_sales (
      id SERIAL PRIMARY KEY,
      model VARCHAR(100) NOT NULL,
      year INT NOT NULL,
      price NUMERIC(12,2) NOT NULL,
      units_sold INT NOT NULL
    );
  `);
})();

const BmwSalesModel = {
    async getAll() {
        const result = await pool.query('SELECT * FROM bmw_sales ORDER BY id ASC');
        return result.rows;
    },

    async getById(id) {
        const result = await pool.query('SELECT * FROM bmw_sales WHERE id = $1', [id]);
        return result.rows[0];
    },

    async create({ model, year, price, unitsSold }) {
        const result = await pool.query(
            'INSERT INTO bmw_sales (model, year, price, units_sold) VALUES ($1, $2, $3, $4) RETURNING *',
            [model, year, price, unitsSold]
        );
        return result.rows[0];
    },

    async update(id, { model, year, price, unitsSold }) {
        const result = await pool.query(
            'UPDATE bmw_sales SET model=$1, year=$2, price=$3, units_sold=$4 WHERE id=$5 RETURNING *',
            [model, year, price, unitsSold, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await pool.query('DELETE FROM bmw_sales WHERE id=$1 RETURNING *', [id]);
        return result.rows[0];
    }
};

module.exports = BmwSalesModel;
