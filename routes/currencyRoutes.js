const express = require('express');
const { check } = require('express-validator');
const CurrencyController = require('../controllers/CurrencyController');
// const authMiddleware = require('../middleware/auth'); // Assume auth middleware

const router = express.Router();

// Validation rules
const currencyValidation = [
  check('currencyName')
    .notEmpty().withMessage('CurrencyName is required')
    .isString().withMessage('CurrencyName must be a string')
    .trim()
];

// Routes
router.get('/', CurrencyController.getAllCurrencies);
router.post('/', currencyValidation, CurrencyController.createCurrency);
router.get('/:id', CurrencyController.getCurrencyById);
router.put('/:id', currencyValidation, CurrencyController.updateCurrency);
router.delete('/:id', CurrencyController.deleteCurrency);

module.exports = router;