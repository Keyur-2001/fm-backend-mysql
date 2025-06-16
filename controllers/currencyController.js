const { validationResult } = require('express-validator');
const CurrencyModel = require('../models/currencyModel');

// Get all currencies
const getAllCurrencies = async (req, res) => {
  try {
    const { pageNumber, pageSize, fromDate, toDate } = req.query;
    console.log('getAllCurrencies query:', { pageNumber, pageSize, fromDate, toDate });

    const result = await CurrencyModel.getAllCurrencies({
      pageNumber: parseInt(pageNumber) || 1,
      pageSize: parseInt(pageSize) || 10,
      fromDate,
      toDate
    });

    res.status(200).json({
      success: true,
      message: 'Currencies retrieved successfully',
      data: result.data,
      totalRecords: result.totalRecords
    });
  } catch (error) {
    console.error('getAllCurrencies error:', error.stack);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};

// Create a currency
const createCurrency = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currencyName } = req.body;
    const createdById = req.user?.userId || 1006; // Assume auth middleware provides userId
    console.log('createCurrency body:', req.body, 'createdById:', createdById);

    const result = await CurrencyModel.createCurrency({
      currencyName,
      createdById
    });

    res.status(201).json({
      success: true,
      message: result.message,
      currencyId: result.currencyId
    });
  } catch (error) {
    console.error('createCurrency error:', error.stack);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};

// Get currency by ID
const getCurrencyById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('getCurrencyById id:', id);

    const currency = await CurrencyModel.getCurrencyById(id);

    if (!currency) {
      return res.status(404).json({
        success: false,
        message: 'Currency not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Currency retrieved successfully',
      data: currency
    });
  } catch (error) {
    console.error('getCurrencyById error:', error.stack);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};

// Update a currency
const updateCurrency = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { currencyName } = req.body;
    const createdById = req.user?.userId || 1006;
    console.log('updateCurrency id:', id, 'body:', req.body, 'createdById:', createdById);

    const result = await CurrencyModel.updateCurrency(id, {
      currencyName,
      createdById
    });

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('updateCurrency error:', error.stack);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};

// Delete a currency
const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const createdById = req.user?.userId || 1006;
    console.log('deleteCurrency id:', id, 'createdById:', createdById);

    const result = await CurrencyModel.deleteCurrency(id, createdById);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('deleteCurrency error:', error.stack);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};

module.exports = {
  getAllCurrencies,
  createCurrency,
  getCurrencyById,
  updateCurrency,
  deleteCurrency
};