const PInvoiceModel = require("../models/pInvoiceModel");

class PInvoiceController {
  // Get all Purchase Invoices
  static async getAllPInvoices(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;
      const result = await PInvoiceModel.getAllPInvoices({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        fromDate: fromDate || null,
        toDate: toDate || null,
      });
      res.status(200).json({
        success: true,
        message: "Purchase Invoice records retrieved successfully.",
        data: result.data,
        totalRecords: result.totalRecords,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    } catch (err) {
      console.error("Error in getAllPInvoices:", err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    }
  }

  // Create a new Purchase Invoice
  static async createPInvoice(req, res) {
    try {
      const allowedRoles = [
        "Administrator",
        "Accounts Payable",
        "Purchase Manager",
      ];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Only Administrators, Accounts Payable, or Purchase Managers can create Purchase Invoice",
          data: null,
          pInvoiceId: null,
          newPInvoiceId: null,
        });
      }

      const data = {
        POID: req.body.POID,
        Series: req.body.Series,
        UserID: req.user.personId,
        PostingDate: req.body.PostingDate,
        RequiredByDate: req.body.RequiredByDate,
        DeliveryDate: req.body.DeliveryDate,
        DateReceived: req.body.DateReceived,
        Terms: req.body.Terms,
        PackagingRequiredYN: req.body.PackagingRequiredYN,
        CollectFromSupplierYN: req.body.CollectFromSupplierYN,
        ExternalRefNo: req.body.ExternalRefNo,
        ExternalSupplierID: req.body.ExternalSupplierID,
        IsPaid: req.body.IsPaid,
        FormCompletedYN: req.body.FormCompletedYN,
        FileName: req.body.FileName,
        FileContent: req.body.FileContent,
        CopyTaxesFromPO: req.body.CopyTaxesFromPO,
        TaxChargesTypeID: req.body.TaxChargesTypeID,
        TaxRate: req.body.TaxRate,
        TaxTotal: req.body.TaxTotal,
        OriginWarehouseAddressID: req.body.OriginWarehouseAddressID,
        DestinationWarehouseAddressID: req.body.DestinationWarehouseAddressID,
      };

      if (!data.POID) {
        return res.status(400).json({
          success: false,
          message: "POID is required.",
          data: null,
          pInvoiceId: null,
          newPInvoiceId: null,
        });
      }

      const result = await PInvoiceModel.createPInvoice(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        pInvoiceId: null,
        newPInvoiceId: result.newPInvoiceId,
      });
    } catch (err) {
      console.error("Error in createPInvoice:", err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    }
  }

  // Get a single Purchase Invoice by ID
  static async getPInvoiceById(req, res) {
    try {
      const { id } = req.params;
      const pInvoice = await PInvoiceModel.getPInvoiceById(parseInt(id));
      if (!pInvoice) {
        return res.status(404).json({
          success: false,
          message: "Purchase Invoice not found or deleted.",
          data: null,
          pInvoiceId: null,
          newPInvoiceId: null,
        });
      }
      res.status(200).json({
        success: true,
        message: "Purchase Invoice retrieved successfully.",
        data: pInvoice,
        pInvoiceId: id,
        newPInvoiceId: null,
      });
    } catch (err) {
      console.error("Error in getPInvoiceById:", err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    }
  }

  // Update a Purchase Invoice
  static async updatePInvoice(req, res) {
    try {
      const { id } = req.params;
      const data = {
        UserID: req.user.personId,
        PostingDate: req.body.PostingDate,
        RequiredByDate: req.body.RequiredByDate,
        DeliveryDate: req.body.DeliveryDate,
        DateReceived: req.body.DateReceived,
        Terms: req.body.Terms,
        PackagingRequiredYN: req.body.PackagingRequiredYN,
        CollectFromSupplierYN: req.body.CollectFromSupplierYN,
        ExternalRefNo: req.body.ExternalRefNo,
        ExternalSupplierID: req.body.ExternalSupplierID,
        IsPaid: req.body.IsPaid,
        FormCompletedYN: req.body.FormCompletedYN,
        FileName: req.body.FileName,
        FileContent: req.body.FileContent,
        OriginWarehouseAddressID: req.body.OriginWarehouseAddressID,
        DestinationWarehouseAddressID: req.body.DestinationWarehouseAddressID,
      };

      const result = await PInvoiceModel.updatePInvoice(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        pInvoiceId: id,
        newPInvoiceId: null,
      });
    } catch (err) {
      console.error("Error in updatePInvoice:", err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    }
  }

  // Delete a Purchase Invoice
  static async deletePInvoice(req, res) {
    try {
      const { id } = req.params;
      const deletedById = req.user?.personId;
      if (!deletedById) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
          data: null,
          pInvoiceId: null,
          newPInvoiceId: null,
        });
      }

      const result = await PInvoiceModel.deletePInvoice(
        parseInt(id),
        deletedById
      );
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        pInvoiceId: id,
        newPInvoiceId: null,
      });
    } catch (err) {
      console.error("Error in deletePInvoice:", err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    }
  }

  // Upload invoice file
  static async uploadInvoiceFile(req, res) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
          data: null,
          pInvoiceId: null,
          newPInvoiceId: null,
        });
      }

      const fileData = {
        FileName: req.file.originalname,
        FileContent: req.file.buffer,
        UserID: req.user.personId,
      };

      const result = await PInvoiceModel.updatePInvoice(parseInt(id), fileData);
      res.status(200).json({
        success: true,
        message: "Invoice file uploaded successfully.",
        data: null,
        pInvoiceId: id,
        newPInvoiceId: null,
      });
    } catch (err) {
      console.error("Error in uploadInvoiceFile:", err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    }
  }

  static async approvePInvoice(req, res) {
    try {
      const { pInvoiceID } = req.body;
      const approverID = req.user.personId;

      if (!pInvoiceID) {
        return res.status(400).json({
          success: false,
          message: "pInvoiceID is required",
          data: null,
          pInvoiceId: null,
          newPInvoiceId: null,
        });
      }

      if (!req.user || !approverID) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
          data: null,
          pInvoiceId: null,
          newPInvoiceId: null,
        });
      }

      const approvalData = {
        PInvoiceID: parseInt(pInvoiceID),
        ApproverID: parseInt(approverID),
      };

      const result = await PInvoiceModel.approvePInvoice(approvalData);
      return res
        .status(result.success ? (result.isFullyApproved ? 200 : 202) : 403)
        .json(result);
    } catch (error) {
      console.error("Approve PInvoice error:", error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    }
  }
}

module.exports = PInvoiceController;
