<<<<<<< HEAD
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
=======
const ItemModel = require('../models/itemModel');

class ItemController {
  // Get all Items with pagination
  static async getAllItems(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;

      const items = await ItemModel.getAllItems({
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize),
        fromDate,
        toDate
      });

      return res.status(200).json({
        success: true,
        message: 'Items retrieved successfully',
        data: items.data,
        totalRecords: items.totalRecords
      });
    } catch (err) {
      console.error('getAllItems error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        itemId: null
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      });
    }
  }

<<<<<<< HEAD
=======
  // Create a new Item
  static async createItem(req, res) {
    try {
      const {
        itemCode,
        itemName,
        certificationId,
        itemImage,
        itemImageFileName,
        itemGroupId,
        defaultUomId,
        createdById
      } = req.body;

      // Basic validation
      if (!itemCode || !itemName || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'ItemCode, ItemName, and CreatedByID are required',
          data: null,
          itemId: null
        });
      }

      const result = await ItemModel.createItem({
        itemCode,
        itemName,
        certificationId,
        itemImage,
        itemImageFileName,
        itemGroupId,
        defaultUomId,
        createdById
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        itemId: result.itemId
      });
    } catch (err) {
      console.error('createItem error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        itemId: null
      });
    }
  }

  // Get a single Item by ID
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
  static async getItemById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
<<<<<<< HEAD
          message: 'Invalid Item ID'
        });
      }

      const item = await ItemModel.getItemById(id);
=======
          message: 'Valid ItemID is required',
          data: null,
          itemId: null
        });
      }

      const item = await ItemModel.getItemById(parseInt(id));
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7

      if (!item) {
        return res.status(404).json({
          success: false,
<<<<<<< HEAD
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
=======
          message: 'Item not found',
          data: null,
          itemId: id
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Item retrieved successfully',
        data: item,
        itemId: id
      });
    } catch (err) {
      console.error('getItemById error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        itemId: null
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      });
    }
  }

<<<<<<< HEAD
  static async updateItem(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
=======
  // Update an Item
  static async updateItem(req, res) {
    try {
      const { id } = req.params;
      const {
        itemCode,
        itemName,
        certificationId,
        itemImage,
        itemImageFileName,
        itemGroupId,
        defaultUomId,
        createdById
      } = req.body;
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
<<<<<<< HEAD
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
=======
          message: 'Valid ItemID is required',
          data: null,
          itemId: null
        });
      }

      if (!itemCode || !itemName || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'ItemCode, ItemName, and CreatedByID are required',
          data: null,
          itemId: id
        });
      }

      const result = await ItemModel.updateItem(parseInt(id), {
        itemCode,
        itemName,
        certificationId,
        itemImage,
        itemImageFileName,
        itemGroupId,
        defaultUomId,
        createdById
      });

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        itemId: id
      });
    } catch (err) {
      console.error('updateItem error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        itemId: null
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      });
    }
  }

<<<<<<< HEAD
  static async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const deletedByID = req.user?.id || req.body.DeletedByID;
=======
  // Delete an Item
  static async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
<<<<<<< HEAD
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
=======
          message: 'Valid ItemID is required',
          data: null,
          itemId: null
        });
      }

      if (!createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedByID is required',
          data: null,
          itemId: id
        });
      }

      const result = await ItemModel.deleteItem(parseInt(id), createdById);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        itemId: id
      });
    } catch (err) {
      console.error('deleteItem error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        itemId: null
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      });
    }
  }
}

module.exports = ItemController;