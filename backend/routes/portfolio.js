const express = require('express');
const { getPortfolio, addStock, updateStock, deleteStock } = require('../controllers/portfolioController');

const router = express.Router();

router.get('/', getPortfolio);
router.post('/', addStock);
router.put('/', updateStock);
router.delete('/:id', deleteStock);

module.exports = router;
