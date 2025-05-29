const CollectionRateModel = require('../models/collectionRateModel');

class CollectionRateController {
  static async getAllCollectionRates(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;

      const collectionRates = await CollectionRateModel.getAllCollectionRates({
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize),
        fromDate,
        toDate
      });

      return res.status(200).json({
        success: true,
        message: collectionRates.message || 'Collection rates retrieved successfully',
        data: collectionRates.data,
        totalRecords: collectionRates.totalRecords
      });
    } catch (err) {
      console.error('getAllCollectionRates error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        collectionRateId: null
      });
    }
  }

  static async createCollectionRate(req, res) {
    try {
      const { warehouseId, distanceRadiusMin, distanceRadiusMax, rate, currencyId, createdById } = req.body;

      if (!warehouseId || distanceRadiusMin == null || distanceRadiusMax == null || rate == null || !currencyId || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'WarehouseID, DistanceRadiusMin, DistanceRadiusMax, Rate, CurrencyID, and CreatedByID are required',
          data: null,
          collectionRateId: null
        });
      }

      if (distanceRadiusMin < 0 || distanceRadiusMax <= distanceRadiusMin || rate <= 0) {
        return res.status(400).json({
          success: false,
          message: 'DistanceRadiusMin must be non-negative, DistanceRadiusMax must be greater than DistanceRadiusMin, and Rate must be positive',
          data: null,
          collectionRateId: null
        });
      }

      const result = await CollectionRateModel.createCollectionRate({
        warehouseId,
        distanceRadiusMin,
        distanceRadiusMax,
        rate,
        currencyId,
        createdById
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        collectionRateId: result.collectionRateId
      });
    } catch (err) {
      console.error('createCollectionRate error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        collectionRateId: null
      });
    }
  }

  static async getCollectionRateById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid CollectionRateID is required',
          data: null,
          collectionRateId: null
        });
      }

      const collectionRate = await CollectionRateModel.getCollectionRateById(parseInt(id));

      if (!collectionRate) {
        return res.status(404).json({
          success: false,
          message: 'Collection rate not found',
          data: null,
          collectionRateId: id
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Collection rate retrieved successfully',
        data: collectionRate,
        collectionRateId: id
      });
    } catch (err) {
      console.error('getCollectionRateById error:', err);
      if (err.message.includes('Collection rate not found')) {
        return res.status(404).json({
          success: false,
          message: 'Collection rate not found',
          data: null,
          collectionRateId: req.params.id || null
        });
      }
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        collectionRateId: null
      });
    }
  }

  static async updateCollectionRate(req, res) {
    try {
      const { id } = req.params;
      const { warehouseId, distanceRadiusMin, distanceRadiusMax, rate, currencyId, createdById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid CollectionRateID is required',
          data: null,
          collectionRateId: null
        });
      }

      if (distanceRadiusMin != null && distanceRadiusMin < 0) {
        return res.status(400).json({
          success: false,
          message: 'DistanceRadiusMin must be non-negative',
          data: null,
          collectionRateId: id
        });
      }

      if (distanceRadiusMin != null && distanceRadiusMax != null && distanceRadiusMax <= distanceRadiusMin) {
        return res.status(400).json({
          success: false,
          message: 'DistanceRadiusMax must be greater than DistanceRadiusMin',
          data: null,
          collectionRateId: id
        });
      }

      if (rate != null && rate <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Rate must be positive',
          data: null,
          collectionRateId: id
        });
      }

      const result = await CollectionRateModel.updateCollectionRate(parseInt(id), {
        warehouseId,
        distanceRadiusMin,
        distanceRadiusMax,
        rate,
        currencyId,
        createdById
      });

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        collectionRateId: id
      });
    } catch (err) {
      console.error('updateCollectionRate error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        collectionRateId: null
      });
    }
  }

  static async deleteCollectionRate(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid CollectionRateID is required',
          data: null,
          collectionRateId: null
        });
      }

      if (!createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedByID is required',
          data: null,
          collectionRateId: id
        });
      }

      const result = await CollectionRateModel.deleteCollectionRate(parseInt(id), createdById);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        collectionRateId: id
      });
    } catch (err) {
      console.error('deleteCollectionRate error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        collectionRateId: null
      });
    }
  }
}

module.exports = CollectionRateController;