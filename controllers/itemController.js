// controllers/itemController.js
const ItemModel = require('../models/itemModel');
// No need for sql or dbConfig since the model handles the connection

class ItemController {
  static async getAllItems(req, res) {
    try {
      const items = await ItemModel.getAllItems();

      if (!items || items.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No items found',
          data: [],
          count: 0
        });
      }

      res.status(200).json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (err) {
      console.error('Error in getAllItems:', err);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }

  static async getItemById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Item ID'
        });
      }

      const item = await ItemModel.getItemById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Item with ID ${id} not found or has been deleted`
        });
      }

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (err) {
      console.error(`Error in getItemById for ID ${req.params.id}:`, err);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }

  static async createItem(req, res) {
    try {
      const data = req.body;

      if (!data || !data.ItemName) {
        return res.status(400).json({
          success: false,
          message: 'ItemName is required'
        });
      }

      const newItem = await ItemModel.createItem(data);

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: newItem
      });
    } catch (err) {
      console.error('Error in createItem:', err);
      if (err.message.includes('ItemName')) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }

  static async updateItem(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Item ID'
        });
      }

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Update data is required'
        });
      }

      if (data.ItemName === '') {
        return res.status(400).json({
          success: false,
          message: 'ItemName cannot be empty'
        });
      }

      const updatedItem = await ItemModel.updateItem(id, data);

      if (!updatedItem) {
        return res.status(404).json({
          success: false,
          message: `Item with ID ${id} not found or has been deleted`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: updatedItem
      });
    } catch (err) {
      console.error(`Error in updateItem for ID ${req.params.id}:`, err);
      if (err.message.includes('ItemName') || err.message.includes('valid fields')) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }

  static async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const deletedByID = req.user?.id || req.body.DeletedByID;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Item ID'
        });
      }

      if (!deletedByID || isNaN(deletedByID)) {
        return res.status(400).json({
          success: false,
          message: 'DeletedByID is required and must be a valid number'
        });
      }

      const deleted = await ItemModel.deleteItem(id, deletedByID);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Item with ID ${id} not found or has been deleted`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully'
      });
    } catch (err) {
      console.error(`Error in deleteItem for ID ${req.params.id}:`, err);
      if (err.message.includes('DeletedByID')) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }
}

module.exports = ItemController;