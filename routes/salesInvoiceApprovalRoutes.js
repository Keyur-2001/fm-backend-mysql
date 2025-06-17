const express = require("express");
const router = express.Router();
const SalesInvoiceApprovalController = require("../controllers/SalesInvoiceApprovalController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/",
  authMiddleware,
  SalesInvoiceApprovalController.getSalesInvoiceApprovals
);

router.get(
  "/:salesInvoiceID/:approverID",
  SalesInvoiceApprovalController.getSalesInvoiceApprovalById
);

router.post(
  "/",
  authMiddleware,
  SalesInvoiceApprovalController.createSalesInvoiceApproval
);

router.put(
  "/",
  authMiddleware,
  SalesInvoiceApprovalController.updateSalesInvoiceApproval
);

router.delete(
  "/",
  authMiddleware,
  SalesInvoiceApprovalController.deleteSalesInvoiceApproval
);

module.exports = router;
