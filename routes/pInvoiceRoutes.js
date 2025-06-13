const express = require("express");
const router = express.Router();
const multer = require("multer");
const PInvoiceController = require("../controllers/pInvoiceController");
const authMiddleware = require("../middleware/authMiddleware");

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB limit for MEDIUMBLOB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, images, Word, and Excel files are allowed."
        ),
        false
      );
    }
  },
});

// Get all Purchase Invoices
router.get("/", PInvoiceController.getAllPInvoices);

// Create a new Purchase Invoice
router.post("/", authMiddleware, PInvoiceController.createPInvoice);

// Get a single Purchase Invoice by ID
router.get("/:id", PInvoiceController.getPInvoiceById);

// Update a Purchase Invoice
router.put("/:id", authMiddleware, PInvoiceController.updatePInvoice);

// Delete a Purchase Invoice
router.delete("/:id", authMiddleware, PInvoiceController.deletePInvoice);

// Upload invoice file
router.post(
  "/:id/upload",
  authMiddleware,
  upload.single("invoiceFile"),
  PInvoiceController.uploadInvoiceFile
);

// Approve a Purchase Invoice
router.post("/approve", authMiddleware, PInvoiceController.approvePInvoice);

// Mark invoice as paid
router.patch("/:id/mark-paid", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.personId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
        data: null,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    }

    const PInvoiceModel = require("../models/pInvoiceModel");
    const result = await PInvoiceModel.markAsPaid(parseInt(id), userId);

    res.status(200).json({
      success: true,
      message: "Invoice marked as paid successfully.",
      data: null,
      pInvoiceId: id,
      newPInvoiceId: null,
    });
  } catch (err) {
    console.error("Error in mark-paid:", err);
    res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
      data: null,
      pInvoiceId: null,
      newPInvoiceId: null,
    });
  }
});

// Mark form as completed
router.patch("/:id/mark-completed", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.personId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
        data: null,
        pInvoiceId: null,
        newPInvoiceId: null,
      });
    }

    const PInvoiceModel = require("../models/pInvoiceModel");
    const result = await PInvoiceModel.markFormCompleted(parseInt(id), userId);

    res.status(200).json({
      success: true,
      message: "Form marked as completed successfully.",
      data: null,
      pInvoiceId: id,
      newPInvoiceId: null,
    });
  } catch (err) {
    console.error("Error in mark-completed:", err);
    res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
      data: null,
      pInvoiceId: null,
      newPInvoiceId: null,
    });
  }
});

// Get all approvals for a Purchase Invoice
router.get("/:id/approvals", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const PInvoiceModel = require("../models/pInvoiceModel");
    const result = await PInvoiceModel.getAllPInvoiceApprovals(parseInt(id));
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in get approvals:", err);
    res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
      data: null,
      pInvoiceId: null,
      newPInvoiceId: null,
    });
  }
});

module.exports = router;
