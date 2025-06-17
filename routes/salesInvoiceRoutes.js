const express = require("express");
const router = express.Router();
const SalesInvoiceController = require("../controllers/salesInvoiceController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all Sales Invoices
router.get("/", SalesInvoiceController.getAllSalesInvoices);

// Get a single Sales Invoice by ID
router.get("/:id", SalesInvoiceController.getSalesInvoiceById);

// Create a Sales Invoice (protected route)
router.post("/", authMiddleware, SalesInvoiceController.createSalesInvoice);

// Approve a Sales Invoice (protected route)
router.post(
  "/approve",
  authMiddleware,
  SalesInvoiceController.approveSalesInvoice
);

module.exports = router;
