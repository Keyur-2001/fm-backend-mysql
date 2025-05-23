const WarehouseModel = require('../models/warehouseModel');

class WarehouseController {
  static async getAllWarehouses(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;

      const warehouses = await WarehouseModel.getAllWarehouses({
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize),
        fromDate,
        toDate
      });

      return res.status(200).json({
        success: true,
        message: 'Warehouses retrieved successfully',
        data: warehouses.data,
        totalRecords: warehouses.totalRecords
      });
    } catch (err) {
      console.error('getAllWarehouses error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        warehouseId: null
      });
    }
  }

  static async createWarehouse(req, res) {
    try {
      const { warehouseName, warehouseAddressId, createdById } = req.body;

      if (!warehouseName || !warehouseAddressId || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'WarehouseName, WarehouseAddressID, and CreatedByID are required',
          data: null,
          warehouseId: null
        });
      }

      const result = await WarehouseModel.createWarehouse({
        warehouseName,
        warehouseAddressId,
        createdById
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        warehouseId: result.warehouseId
      });
    } catch (err) {
      console.error('createWarehouse error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        warehouseId: null
      });
    }
  }

  static async getWarehouseById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid WarehouseID is required',
          data: null,
          warehouseId: null
        });
      }

      const warehouse = await WarehouseModel.getWarehouseById(parseInt(id));

      if (!warehouse) {
        return res.status(404).json({
          success: false,
          message: 'Warehouse not found',
          data: null,
          warehouseId: id
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Warehouse retrieved successfully',
        data: warehouse,
        warehouseId: id
      });
    } catch (err) {
      console.error('getWarehouseById error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        warehouseId: null
      });
    }
  }

  static async updateWarehouse(req, res) {
    try {
      const { id } = req.params;
      const { warehouseName, warehouseAddressId, createdById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid WarehouseID is required',
          data: null,
          warehouseId: null
        });
      }

      if (!warehouseName || !warehouseAddressId || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'WarehouseName, WarehouseAddressID, and CreatedByID are required',
          data: null,
          warehouseId: id
        });
      }

      const result = await WarehouseModel.updateWarehouse(parseInt(id), {
        warehouseName,
        warehouseAddressId,
        createdById
      });

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        warehouseId: id
      });
    } catch (err) {
      console.error('updateWarehouse error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        warehouseId: null
      });
    }
  }

  static async deleteWarehouse(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid WarehouseID is required',
          data: null,
          warehouseId: null
        });
      }

      if (!createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedByID is required',
          data: null,
          warehouseId: id
        });
      }

      const result = await WarehouseModel.deleteWarehouse(parseInt(id), createdById);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        warehouseId: id
      });
    } catch (err) {
      console.error('deleteWarehouse error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        warehouseId: null
      });
    }
  }
}

module.exports = WarehouseController;