const express = require('express');
const router = express.Router();
const multer = require('multer');
const PInvoiceParcelController = require('../controllers/pInvoiceParcelController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024 // 16MB limit for MEDIUMBLOB
  },
  fileFilter: (req, file, cb) => {            
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, Word, and Excel files are allowed.'), false);
    }
  }
});

// Get all Purchase Invoice Parcels
router.get('/', PInvoiceParcelController.getAllPInvoiceParcels);

// Get all parcels for a specific Purchase Invoice
router.get('/pinvoice/:pInvoiceId', PInvoiceParcelController.getParcelsByPInvoiceId);

// Get a single Purchase Invoice Parcel by ID
router.get('/:id', PInvoiceParcelController.getPInvoiceParcelById);

// Update a Purchase Invoice Parcel
router.put('/:id', authMiddleware, PInvoiceParcelController.updatePInvoiceParcel);

// Delete a Purchase Invoice Parcel
router.delete('/:id', authMiddleware, PInvoiceParcelController.deletePInvoiceParcel);

// Upload parcel file
router.post('/:id/upload', authMiddleware, upload.single('parcelFile'), PInvoiceParcelController.uploadParcelFile);

// Update parcel quantity and recalculate amount
router.patch('/:id/update-quantity', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { itemQuantity, rate } = req.body;
    const userId = req.user?.personId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        data: null,
        pInvoiceParcelId: null
      });
    }

    if (!itemQuantity || !rate) {
      return res.status(400).json({
        success: false,
        message: 'Item quantity and rate are required.',
        data: null,
        pInvoiceParcelId: null
      });
    }

    const PInvoiceParcelModel = require('../models/pInvoiceParcelModel');
    const result = await PInvoiceParcelModel.updateParcelQuantity(parseInt(id), itemQuantity, rate, userId);
    
    res.status(200).json({
      success: true,
      message: 'Parcel quantity updated successfully.',
      data: null,
      pInvoiceParcelId: id
    });
  } catch (err) {
    console.error('Error in update-quantity:', err);
    res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
      data: null,
      pInvoiceParcelId: null
    });
  }
});

// Update parcel rate and recalculate amount
router.patch('/:id/update-rate', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rate, itemQuantity } = req.body;
    const userId = req.user?.personId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        data: null,
        pInvoiceParcelId: null
      });
    }

    if (!rate || !itemQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Rate and item quantity are required.',
        data: null,
        pInvoiceParcelId: null
      });
    }

    const PInvoiceParcelModel = require('../models/pInvoiceParcelModel');
    const result = await PInvoiceParcelModel.updateParcelRate(parseInt(id), rate, itemQuantity, userId);
    
    res.status(200).json({
      success: true,
      message: 'Parcel rate updated successfully.',
      data: null,
      pInvoiceParcelId: id
    });
  } catch (err) {
    console.error('Error in update-rate:', err);
    res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
      data: null,
      pInvoiceParcelId: null
    });
  }
});

// Update parcel certification
router.patch('/:id/update-certification', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { certificationId } = req.body;
    const userId = req.user?.personId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        data: null,
        pInvoiceParcelId: null
      });
    }

    if (!certificationId) {
      return res.status(400).json({
        success: false,
        message: 'Certification ID is required.',
        data: null,
        pInvoiceParcelId: null
      });
    }

    const PInvoiceParcelModel = require('../models/pInvoiceParcelModel');
    const result = await PInvoiceParcelModel.updateParcelCertification(parseInt(id), certificationId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Parcel certification updated successfully.',
      data: null,
      pInvoiceParcelId: id
    });
  } catch (err) {
    console.error('Error in update-certification:', err);
    res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
      data: null,
      pInvoiceParcelId: null
    });
  }
});

// Update parcel country of origin
router.patch('/:id/update-country', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { countryOfOriginId } = req.body;
    const userId = req.user?.personId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        data: null,
        pInvoiceParcelId: null
      });
    }

    if (!countryOfOriginId) {
      return res.status(400).json({
        success: false,
        message: 'Country of Origin ID is required.',
        data: null,
        pInvoiceParcelId: null
      });
    }

    const PInvoiceParcelModel = require('../models/pInvoiceParcelModel');
    const result = await PInvoiceParcelModel.updateParcelCountryOfOrigin(parseInt(id), countryOfOriginId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Parcel country of origin updated successfully.',
      data: null,
      pInvoiceParcelId: id
    });
  } catch (err) {
    console.error('Error in update-country:', err);
    res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
      data: null,
      pInvoiceParcelId: null
    });
  }
});

module.exports = router;