const CollectionRateModel = require('../models/collectionRateModel');

class CollectionRateController {
<<<<<<< HEAD
=======
  // Get all Collection Rates with pagination
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
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
<<<<<<< HEAD
        message: collectionRates.message || 'Collection rates retrieved successfully',
=======
        message: 'Collection rates retrieved successfully',
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
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

<<<<<<< HEAD
=======
  // Get all Collection Rates without pagination
  static async getAllCollectionRatesNoPagination(req, res) {
    try {
      const collectionRates = await CollectionRateModel.getAllCollectionRatesNoPagination();

      return res.status(200).json({
        success: true,
        message: 'All collection rates retrieved successfully',
        data: collectionRates,
        totalRecords: collectionRates.length
      });
    } catch (err) {
      console.error('getAllCollectionRatesNoPagination error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        collectionRateId: null
      });
    }
  }

  // Create a new Collection Rate
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
  static async createCollectionRate(req, res) {
    try {
      const { warehouseId, distanceRadiusMin, distanceRadiusMax, rate, currencyId, createdById } = req.body;

<<<<<<< HEAD
=======
      // Basic validation
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      if (!warehouseId || distanceRadiusMin == null || distanceRadiusMax == null || rate == null || !currencyId || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'WarehouseID, DistanceRadiusMin, DistanceRadiusMax, Rate, CurrencyID, and CreatedByID are required',
          data: null,
          collectionRateId: null
        });
      }

<<<<<<< HEAD
      if (distanceRadiusMin < 0 || distanceRadiusMax <= distanceRadiusMin || rate <= 0) {
        return res.status(400).json({
          success: false,
          message: 'DistanceRadiusMin must be non-negative, DistanceRadiusMax must be greater than DistanceRadiusMin, and Rate must be positive',
          data: null,
          collectionRateId: null
        });
      }

=======
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
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

<<<<<<< HEAD
=======
  // Get a single Collection Rate by ID
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
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
<<<<<<< HEAD
      if (err.message.includes('Collection rate not found')) {
        return res.status(404).json({
          success: false,
          message: 'Collection rate not found',
          data: null,
          collectionRateId: req.params.id || null
        });
      }
=======
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        collectionRateId: null
      });
    }
  }

<<<<<<< HEAD
=======
  // Update a Collection Rate
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
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

<<<<<<< HEAD
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
=======
      if (!warehouseId || distanceRadiusMin == null || distanceRadiusMax == null || rate == null || !currencyId || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'WarehouseID, DistanceRadiusMin, DistanceRadiusMax, Rate, CurrencyID, and CreatedByID are required',
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
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

<<<<<<< HEAD
=======
  // Delete a Collection Rate
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
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