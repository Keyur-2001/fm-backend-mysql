const SupplierQuotationParcelModel = require('../models/supplierQuotationParcelModel');

class SupplierQuotationParcelController {
  // Get a Supplier Quotation Parcel by ID
  static async getSupplierQuotationParcelById(req, res) {
    try {
      const { id } = req.params;
      const supplierQuotationParcel = await SupplierQuotationParcelModel.getSupplierQuotationParcelById(parseInt(id));
      if (!supplierQuotationParcel.parcel) {
        return res.status(404).json({
          success: false,
          message: 'Supplier Quotation Parcel not found or deleted.',
          data: null,
          supplierQuotationParcelId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Supplier Quotation Parcel retrieved successfully.',
        data: supplierQuotationParcel.parcel,
        supplierQuotationParcelId: id
      });
    } catch (err) {
      console.error('Error in getSupplierQuotationParcelById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationParcelId: null
      });
    }
  }

  // Update a Supplier Quotation Parcel
  static async updateSupplierQuotationParcel(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.supplierQuotationId || !data.itemId || !data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'SupplierQuotationId, ItemId, and CreatedById are required.',
          data: null,
          supplierQuotationParcelId: null
        });
      }

      const result = await SupplierQuotationParcelModel.updateSupplierQuotationParcel(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        supplierQuotationParcelId: id
      });
    } catch (err) {
      console.error('Error in updateSupplierQuotationParcel:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationParcelId: null
      });
    }
  }

  // Delete a Supplier Quotation Parcel
  static async deleteSupplierQuotationParcel(req, res) {
    try {
      const { id } = req.params;
      const { deletedById } = req.body;
      if (!deletedById) {
        return res.status(400).json({
          success: false,
          message: 'DeletedById is required.',
          data: null,
          supplierQuotationParcelId: null
        });
      }

      const result = await SupplierQuotationParcelModel.deleteSupplierQuotationParcel(parseInt(id), deletedById);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        supplierQuotationParcelId: id
      });
    } catch (err) {
      console.error('Error in deleteSupplierQuotationParcel:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationParcelId: null
      });
    }
  }
}

module.exports = SupplierQuotationParcelController;