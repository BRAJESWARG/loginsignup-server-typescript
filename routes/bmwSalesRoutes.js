const express = require('express');
const router = express.Router();
const bmwSalesController = require('../controllers/bmwSalesController');

router.get('/', bmwSalesController.getAllSales);
router.post('/', bmwSalesController.createSale);
router.put('/:id', bmwSalesController.updateSale);
router.delete('/:id', bmwSalesController.deleteSale);

module.exports = router;
