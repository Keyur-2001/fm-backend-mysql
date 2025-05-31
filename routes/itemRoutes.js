<<<<<<< HEAD
// routes/itemRoutes.js
=======
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/itemController');

<<<<<<< HEAD
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
=======
// Routes for Item management
router.get('/', ItemController.getAllItems); // GET /api/items
router.post('/', ItemController.createItem); // POST /api/items
router.get('/:id', ItemController.getItemById); // GET /api/items/:id
router.put('/:id', ItemController.updateItem); // PUT /api/items/:id
router.delete('/:id', ItemController.deleteItem); // DELETE /api/items/:id
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7

module.exports = router;