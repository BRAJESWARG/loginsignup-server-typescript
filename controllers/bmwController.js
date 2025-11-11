const client = require('../config/db');

// CREATE
const addSale = async (req, res) => {
    const { model, units_sold, revenue } = req.body;
    try {
        await client.query(
            'INSERT INTO BmwSales (model, units_sold, revenue) VALUES ($1, $2, $3)',
            [model, units_sold, revenue]
        );
        res.status(201).json({ message: 'Sale record added' });
    } catch (err) {
        console.error('Add sale error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// READ
const getAllSales = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM BmwSales ORDER BY sale_date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch sales error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// UPDATE
const updateSale = async (req, res) => {
    const { id } = req.params;
    const { model, units_sold, revenue } = req.body;
    try {
        await client.query(
            'UPDATE BmwSales SET model = $1, units_sold = $2, revenue = $3 WHERE id = $4',
            [model, units_sold, revenue, id]
        );
        res.json({ message: 'Sale record updated' });
    } catch (err) {
        console.error('Update sale error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE
const deleteSale = async (req, res) => {
    const { id } = req.params;
    try {
        await client.query('DELETE FROM BmwSales WHERE id = $1', [id]);
        res.json({ message: 'Sale record deleted' });
    } catch (err) {
        console.error('Delete sale error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addSale, getAllSales, updateSale, deleteSale };
