const CustomerModel = require('../models/customerModel');

class CustomerController {
  static async getAllCustomers(req, res) {
    try {
      const { pageNumber = 1, pageSize = 10, fromDate, toDate } = req.query;

      // Validate pagination parameters
      const pageNum = parseInt(pageNumber, 10);
      const pageSz = parseInt(pageSize, 10);
      if (isNaN(pageNum) || pageNum < 1 || isNaN(pageSz) || pageSz < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pageNumber or pageSize',
          data: null,
          totalRecords: 0
        });
      }

      // Validate date parameters
      if (fromDate && !/^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid fromDate format (use YYYY-MM-DD)',
          data: null,
          totalRecords: 0
        });
      }
      if (toDate && !/^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid toDate format (use YYYY-MM-DD)',
          data: null,
          totalRecords: 0
        });
      }

      const customers = await CustomerModel.getAllCustomers({
        pageNumber: pageNum,
        pageSize: pageSz,
        fromDate,
        toDate
      });

      return res.status(200).json({
        success: true,
        message: 'Customers retrieved successfully',
        data: customers.data || [],
        totalRecords: customers.totalRecords || 0
      });
    } catch (err) {
      console.error('getAllCustomers error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }

  static async createCustomer(req, res) {
    try {
      const {
        CustomerName,
        CompanyID,
        CustomerEmail,
        ImportCode,
        BillingCurrencyID,
        Website,
        CustomerNotes,
        isInQuickBooks,
        QuickBookAccountID,
        CustomerAddressID,
        CreatedByID
      } = req.body;

      // Validate input
      if (!CustomerName || typeof CustomerName !== 'string' || CustomerName.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Valid CustomerName is required',
          data: null,
          totalRecords: 0
        });
      }
      if (!CompanyID || isNaN(parseInt(CompanyID))) {
        return res.status(400).json({
          success: false,
          message: 'Valid CompanyID is required',
          data: null,
          totalRecords: 0
        });
      }
      if (!CreatedByID || isNaN(parseInt(CreatedByID))) {
        return res.status(400).json({
          success: false,
          message: 'Valid CreatedByID is required',
          data: null,
          totalRecords: 0
        });
      }
      if (CustomerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CustomerEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid CustomerEmail format',
          data: null,
          totalRecords: 0
        });
      }
      if (BillingCurrencyID && isNaN(parseInt(BillingCurrencyID))) {
        return res.status(400).json({
          success: false,
          message: 'Valid BillingCurrencyID is required',
          data: null,
          totalRecords: 0
        });
      }
      if (CustomerAddressID && isNaN(parseInt(CustomerAddressID))) {
        return res.status(400).json({
          success: false,
          message: 'Valid CustomerAddressID is required',
          data: null,
          totalRecords: 0
        });
      }

      const data = {
        CustomerName: CustomerName.trim(),
        CompanyID: parseInt(CompanyID),
        CustomerEmail: CustomerEmail || null,
        ImportCode: ImportCode || null,
        BillingCurrencyID: BillingCurrencyID ? parseInt(BillingCurrencyID) : null,
        Website: Website || null,
        CustomerNotes: CustomerNotes || null,
        isInQuickBooks: isInQuickBooks ? 1 : 0,
        QuickBookAccountID: QuickBookAccountID || null,
        CustomerAddressID: CustomerAddressID ? parseInt(CustomerAddressID) : null,
        CreatedByID: parseInt(CreatedByID)
      };

      console.log('Creating customer with data:', JSON.stringify(data, null, 2));
      const result = await CustomerModel.createCustomer(data);
      console.log('Create customer result:', JSON.stringify(result, null, 2));

      if (!result || !result.customerId) {
        throw new Error('Failed to create customer: Invalid response from model');
      }

      return res.status(201).json({
        success: true,
        message: result.message || 'Customer created successfully',
        data: data,
        totalRecords: 0
      });
    } catch (err) {
      console.error('createCustomer error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }

  static async getCustomerById(req, res) {
    try {
      const { id } = req.params;

      const customerId = parseInt(id, 10);
      if (!id || isNaN(customerId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid CustomerID is required',
          data: null,
          totalRecords: 0
        });
      }

      const customer = await CustomerModel.getCustomerById(customerId);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
          data: null,
          totalRecords: 0
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Customer retrieved successfully',
        data: customer,
        totalRecords: 1
      });
    } catch (err) {
      console.error('getCustomerById error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }

  static async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const {
        CustomerName,
        CompanyID,
        CustomerEmail,
        ImportCode,
        BillingCurrencyID,
        Website,
        CustomerNotes,
        isInQuickBooks,
        QuickBookAccountID,
        CustomerAddressID,
        CreatedByID
      } = req.body;

      const customerId = parseInt(id, 10);
      if (!id || isNaN(customerId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid CustomerID is required',
          data: null,
          totalRecords: 0
        });
      }

      if (!CustomerName || typeof CustomerName !== 'string' || CustomerName.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Valid CustomerName is required',
          data: null,
          totalRecords: 0
        });
      }
      if (!CompanyID || isNaN(parseInt(CompanyID))) {
        return res.status(400).json({
          success: false,
          message: 'Valid CompanyID is required',
          data: null,
          totalRecords: 0
        });
      }
      if (!CreatedByID || isNaN(parseInt(CreatedByID))) {
        return res.status(400).json({
          success: false,
          message: 'Valid CreatedByID is required',
          data: null,
          totalRecords: 0
        });
      }
      if (CustomerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CustomerEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid CustomerEmail format',
          data: null,
          totalRecords: 0
        });
      }
      if (BillingCurrencyID && isNaN(parseInt(BillingCurrencyID))) {
        return res.status(400).json({
          success: false,
          message: 'Valid BillingCurrencyID is required',
          data: null,
          totalRecords: 0
        });
      }
      if (CustomerAddressID && isNaN(parseInt(CustomerAddressID))) {
        return res.status(400).json({
          success: false,
          message: 'Valid CustomerAddressID is required',
          data: null,
          totalRecords: 0
        });
      }

      const data = {
        CustomerName: CustomerName.trim(),
        CompanyID: parseInt(CompanyID),
        CustomerEmail: CustomerEmail || null,
        ImportCode: ImportCode || null,
        BillingCurrencyID: BillingCurrencyID ? parseInt(BillingCurrencyID) : null,
        Website: Website || null,
        CustomerNotes: CustomerNotes || null,
        isInQuickBooks: isInQuickBooks ? 1 : 0,
        QuickBookAccountID: QuickBookAccountID || null,
        CustomerAddressID: CustomerAddressID ? parseInt(CustomerAddressID) : null,
        CreatedByID: parseInt(CreatedByID)
      };

      console.log('Updating customer with id:', customerId, 'and data:', JSON.stringify(data, null, 2));
      const result = await CustomerModel.updateCustomer(customerId, data);
      console.log('Update customer result:', JSON.stringify(result, null, 2));

      if (!result) {
        throw new Error('Invalid response from CustomerModel');
      }

      return res.status(200).json({
        success: true,
        message: result.message || 'Customer updated successfully',
        data: null,
        totalRecords: 0
      });
    } catch (err) {
      console.error('updateCustomer error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }

  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;

      const customerId = parseInt(id, 10);
      if (!id || isNaN(customerId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid CustomerID is required',
          data: null,
          totalRecords: 0
        });
      }

      if (!createdById || isNaN(parseInt(createdById))) {
        return res.status(400).json({
          success: false,
          message: 'Valid CreatedByID is required',
          data: null,
          totalRecords: 0
        });
      }

      console.log('Deleting customer with id:', customerId, 'by createdById:', createdById);
      const result = await CustomerModel.deleteCustomer(customerId, parseInt(createdById));
      console.log('Delete customer result:', JSON.stringify(result, null, 2));

      return res.status(200).json({
        success: true,
        message: result.message || 'Customer deleted successfully',
        data: null,
        totalRecords: 0
      });
    } catch (err) {
      console.error('deleteCustomer error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }
}

module.exports = CustomerController;