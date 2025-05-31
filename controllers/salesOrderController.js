const SalesOrderModel = require('../models/SalesOrderModel');

class SalesOrderController {
  static async createSalesOrder(req, res) {
    try {
      const allowedRoles = ['Administrator', 'Customer Order Coordinator'];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only Administrators or Customer Order Coordinators can create SalesOrder',
          data: null,
          salesOrderId: null,
          newSalesOrderId: null
        });
      }

      const salesOrderData = {
        SalesQuotationID: req.body.SalesQuotationID ? parseInt(req.body.SalesQuotationID) : null,
        CreatedByID: parseInt(req.body.CreatedByID) || req.user.personId,
        ShippingPriorityID: req.body.ShippingPriorityID ? parseInt(req.body.ShippingPriorityID) : null,
        PostingDate: req.body.PostingDate || null
      };

      const result = await SalesOrderModel.createSalesOrder(salesOrderData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Create SalesOrder error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesOrderId: null,
        newSalesOrderId: null
      });
    }
  }

  static async updateSalesOrder(req, res) {
    try {
      const salesOrderId = parseInt(req.params.id);
      if (isNaN(salesOrderId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesOrderID',
          data: null,
          salesOrderId: null,
          newSalesOrderId: null
        });
      }

      const salesOrderData = {
        SalesOrderID: salesOrderId,
        SalesQuotationID: req.body.SalesQuotationID ? parseInt(req.body.SalesQuotationID) : null,
        SalesRFQID: req.body.SalesRFQID ? parseInt(req.body.SalesRFQID) : null,
        CompanyID: req.body.CompanyID ? parseInt(req.body.CompanyID) : null,
        CustomerID: req.body.CustomerID ? parseInt(req.body.CustomerID) : null,
        SupplierID: req.body.SupplierID ? parseInt(req.body.SupplierID) : null,
        OriginAddressID: req.body.OriginAddressID ? parseInt(req.body.OriginAddressID) : null,
        DestinationAddressID: req.body.DestinationAddressID ? parseInt(req.body.DestinationAddressID) : null,
        BillingAddressID: req.body.BillingAddressID ? parseInt(req.body.BillingAddressID) : null,
        CollectionAddressID: req.body.CollectionAddressID ? parseInt(req.body.CollectionAddressID) : null,
        ShippingPriorityID: req.body.ShippingPriorityID ? parseInt(req.body.ShippingPriorityID) : null,
        PackagingRequiredYN: req.body.PackagingRequiredYN != null ? Boolean(req.body.PackagingRequiredYN) : null,
        CollectFromSupplierYN: req.body.CollectFromSupplierYN != null ? Boolean(req.body.CollectFromSupplierYN) : null,
        Terms: req.body.Terms || null,
        PostingDate: req.body.PostingDate || null,
        DeliveryDate: req.body.DeliveryDate || null,
        RequiredByDate: req.body.RequiredByDate || null,
        DateReceived: req.body.DateReceived || null,
        ServiceTypeID: req.body.ServiceTypeID ? parseInt(req.body.ServiceTypeID) : null,
        ExternalRefNo: req.body.ExternalRefNo || null,
        ExternalSupplierID: req.body.ExternalSupplierID ? parseInt(req.body.ExternalSupplierID) : null,
        OrderStatusID: req.body.OrderStatusID ? parseInt(req.body.OrderStatusID) : null,
        ApplyTaxWithholdingAmount: req.body.ApplyTaxWithholdingAmount != null ? Boolean(req.body.ApplyTaxWithholdingAmount) : null,
        CurrencyID: req.body.CurrencyID ? parseInt(req.body.CurrencyID) : null,
        SalesAmount: req.body.SalesAmount ? parseFloat(req.body.SalesAmount) : null,
        TaxesAndOtherCharges: req.body.TaxesAndOtherCharges ? parseFloat(req.body.TaxesAndOtherCharges) : null,
        Total: req.body.Total ? parseFloat(req.body.Total) : null,
        FormCompletedYN: req.body.FormCompletedYN != null ? Boolean(req.body.FormCompletedYN) : null,
        FileName: req.body.FileName || null,
        FileContent: req.body.FileContent || null, // Added FileContent
        ChangedByID: parseInt(req.body.ChangedByID) || req.user.personId
      };

      const result = await SalesOrderModel.updateSalesOrder(salesOrderData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Update SalesOrder error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesOrderId: null,
        newSalesOrderId: null
      });
    }
  }

  static async deleteSalesOrder(req, res) {
    try {
      const salesOrderId = parseInt(req.params.id);
      if (isNaN(salesOrderId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesOrderID',
          data: null,
          salesOrderId: null,
          newSalesOrderId: null
        });
      }

      const salesOrderData = {
        SalesOrderID: salesOrderId,
        ChangedByID: parseInt(req.body.ChangedByID) || req.user.personId
      };

      const result = await SalesOrderModel.deleteSalesOrder(salesOrderData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Delete SalesOrder error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null ,
        salesOrderId: null,
        newSalesOrderId: null
      });
    }
  }

  static async getSalesOrder(req, res) {
    try {
      const salesOrderId = parseInt(req.params.id);
      if (isNaN(salesOrderId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesOrderID',
          data: null,
          salesOrderId: null,
          newSalesOrderId: null
        });
      }

      const salesOrderData = {
        SalesOrderID: salesOrderId
      };

      const result = await SalesOrderModel.getSalesOrder(salesOrderData);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error('Get SalesOrder error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesOrderId: null,
        newSalesOrderId: null
      });
    }
  }

  static async getAllSalesOrders(req, res) {
    try {
      const paginationData = {
        PageNumber: req.query.pageNumber ? parseInt(req.query.pageNumber) : 1,
        PageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
        FromDate: req.query.fromDate || null,
        ToDate: req.query.toDate || null
      };

      const result = await SalesOrderModel.getAllSalesOrders(paginationData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Get All SalesOrders error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesOrderId: null,
        newSalesOrderId: null
      });
    }
  }
}

module.exports = SalesOrderController;
