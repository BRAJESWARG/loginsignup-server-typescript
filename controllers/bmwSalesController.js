const BmwSalesModel = require('../models/bmwSalesModel');

exports.getAllSales = async (req, res) => {
    try {
        const sales = await BmwSalesModel.getAll();
        res.json(sales);
    } catch (error) {
        console.error('❌ Error fetching sales:', error);
        res.status(500).json({ message: 'Server error fetching sales' });
    }
};

exports.createSale = async (req, res) => {
    try {
        const newSale = await BmwSalesModel.create(req.body);
        res.status(201).json(newSale);
    } catch (error) {
        console.error('❌ Error creating sale:', error);
        res.status(500).json({ message: 'Server error creating sale' });
    }
};

exports.updateSale = async (req, res) => {
    try {
        const updated = await BmwSalesModel.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Sale not found' });
        res.json(updated);
    } catch (error) {
        console.error('❌ Error updating sale:', error);
        res.status(500).json({ message: 'Server error updating sale' });
    }
};

exports.deleteSale = async (req, res) => {
    try {
        const deleted = await BmwSalesModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Sale not found' });
        res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting sale:', error);
        res.status(500).json({ message: 'Server error deleting sale' });
    }
};
