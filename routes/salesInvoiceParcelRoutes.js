const express = require("express");
const router = express.Router();
const SalesInvoiceParcelController = require("../controllers/SalesInvoiceParcelController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all Sales Invoice Parcels (supports SalesinvoiceID as query parameter)
router.get("/", SalesInvoiceParcelController.getAllSalesInvoiceParcels);

// Create a Sales Invoice Parcel (protected route)
router.post(
  "/",
  authMiddleware,
  SalesInvoiceParcelController.createSalesInvoiceParcel
);

// Update a Sales Invoice Parcel (protected route)
router.put(
  "/:id",
  authMiddleware,
  SalesInvoiceParcelController.updateSalesInvoiceParcel
);

// Delete a Sales Invoice Parcel (protected route)
router.delete(
  "/:id",
  authMiddleware,
  SalesInvoiceParcelController.deleteSalesInvoiceParcel
);

module.exports = router;
