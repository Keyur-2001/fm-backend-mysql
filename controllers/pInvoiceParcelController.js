const PInvoiceParcelModel = require('../models/pInvoiceParcelModel');

class PInvoiceParcelController {
  // Get all Purchase Invoice Parcels
  static async getAllPInvoiceParcels(req, res) {
    try {
      const { pageNumber, pageSize, PInvoiceID } = req.query;
      const result = await PInvoiceParcelModel.getAllPInvoiceParcels({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        PInvoiceID: parseInt(PInvoiceID) || null
      });
      res.status(200).json({
        success: true,
        message: 'Purchase Invoice Parcel records retrieved successfully.',
        data: result.data,
        totalRecords: result.totalRecords,
        pInvoiceParcelId: null
      });
    } catch (err) {
      console.error('Error in getAllPInvoiceParcels:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceParcelId: null
      });
    }
  }

  // Get a single Purchase Invoice Parcel by ID
  static async getPInvoiceParcelById(req, res) {
    try {
      const { id } = req.params;
      const pInvoiceParcel = await PInvoiceParcelModel.getPInvoiceParcelById(parseInt(id));
      if (!pInvoiceParcel) {
        return res.status(404).json({
          success: false,
          message: 'Purchase Invoice Parcel not found or deleted.',
          data: null,
          pInvoiceParcelId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Purchase Invoice Parcel retrieved successfully.',
        data: pInvoiceParcel,
        pInvoiceParcelId: id
      });
    } catch (err) {
      console.error('Error in getPInvoiceParcelById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceParcelId: null
      });
    }
  }

  // Update a Purchase Invoice Parcel
  static async updatePInvoiceParcel(req, res) {
    try {
      const { id } = req.params;
      const data = {
        ...req.body,
        UserID: req.user.personId
      };

      const result = await PInvoiceParcelModel.updatePInvoiceParcel(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        pInvoiceParcelId: id
      });
    } catch (err) {
      console.error('Error in updatePInvoiceParcel:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceParcelId: null
      });
    }
  }

  // Delete a Purchase Invoice Parcel
  static async deletePInvoiceParcel(req, res) {
    try {
      const { id } = req.params;
      const deletedById = req.user?.personId;
      if (!deletedById) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
          data: null,
          pInvoiceParcelId: null
        });
      }

      const result = await PInvoiceParcelModel.deletePInvoiceParcel(parseInt(id), deletedById);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        pInvoiceParcelId: id
      });
    } catch (err) {
      console.error('Error in deletePInvoiceParcel:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceParcelId: null
      });
    }
  }

  // Upload parcel file
  static async uploadParcelFile(req, res) {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded.',
          data: null,
          pInvoiceParcelId: null
        });
      }

      const fileData = {
        FileName: req.file.originalname,
        FileContent: req.file.buffer,
        UserID: req.user.personId
      };

      const result = await PInvoiceParcelModel.updatePInvoiceParcel(parseInt(id), fileData);
      res.status(200).json({
        success: true,
        message: 'Parcel file uploaded successfully.',
        data: null,
        pInvoiceParcelId: id
      });
    } catch (err) {
      console.error('Error in uploadParcelFile:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceParcelId: null
      });
    }
  }

  // Get all parcels for a specific Purchase Invoice
  static async getParcelsByPInvoiceId(req, res) {
    try {
      const { pInvoiceId } = req.params;
      const parcels = await PInvoiceParcelModel.getParcelsByPInvoiceId(parseInt(pInvoiceId));
      res.status(200).json({
        success: true,
        message: 'Purchase Invoice Parcels retrieved successfully.',
        data: parcels,
        pInvoiceId: pInvoiceId
      });
    } catch (err) {
      console.error('Error in getParcelsByPInvoiceId:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null
      });
    }
  }
}

module.exports = PInvoiceParcelController;