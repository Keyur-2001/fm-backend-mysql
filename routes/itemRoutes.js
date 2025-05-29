// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/itemController');

// Get all items
router.get('/', ItemController.getAllItems);

// Get item by ID
router.get('/:id', ItemController.getItemById);

// Create new item
router.post('/', ItemController.createItem);

// Update item
router.put('/:id', ItemController.updateItem);

// Delete item
router.delete('/:id', ItemController.deleteItem);

module.exports = router;