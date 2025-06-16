const express = require('express');
const router = express.Router();
const BankAccountController = require('../controllers/bankAccountController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all BankAccounts with pagination
router.get('/', authMiddleware, BankAccountController.getAllBankAccounts);

// Create a new BankAccount
router.post('/', authMiddleware, BankAccountController.createBankAccount);

// Get a single BankAccount by ID
router.get('/:id', authMiddleware, BankAccountController.getBankAccountById);

// Update a BankAccount
router.put('/:id', authMiddleware, BankAccountController.updateBankAccount);

// Delete a BankAccount
router.delete('/:id', authMiddleware, BankAccountController.deleteBankAccount);

module.exports = router;