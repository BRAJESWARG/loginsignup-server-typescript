const express = require('express');
const { addSale, getAllSales, updateSale, deleteSale } = require('../controllers/bmwController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, addSale);
router.get('/', verifyToken, getAllSales);
router.put('/:id', verifyToken, updateSale);
router.delete('/:id', verifyToken, deleteSale);

module.exports = router;
