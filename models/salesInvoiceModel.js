const poolPromise = require("../config/db.config");

class SalesInvoiceModel {
  // Get all Sales Invoices
  static async getAllSalesInvoices({
    pageNumber = 1,
    pageSize = 10,
    sortBy = "CreatedDateTime",
    sortOrder = "DESC",
    customerId = null,
    companyId = null,
    supplierId = null,
    dateFrom = null,
    dateTo = null,
    searchTerm = null
  }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
        throw new Error("Invalid pageNumber: must be a positive integer");
      }
      if (!Number.isInteger(pageSize) || pageSize <= 0) {
        throw new Error("Invalid pageSize: must be a positive integer");
      }
      if (!["CreatedDateTime", "PostingDate", "DeliveryDate", "RequiredByDate", "Series", "Total"].includes(sortBy)) {
        throw new Error("Invalid sortBy: must be one of CreatedDateTime, PostingDate, DeliveryDate, RequiredByDate, Series, Total");
      }
      if (!["ASC", "DESC"].includes(sortOrder.toUpperCase())) {
        throw new Error("Invalid sortOrder: must be ASC or DESC");
      }
      if (customerId !== null && (!Number.isInteger(customerId) || customerId <= 0)) {
        throw new Error("Invalid customerId: must be a positive integer");
      }
      if (companyId !== null && (!Number.isInteger(companyId) || companyId <= 0)) {
        throw new Error("Invalid companyId: must be a positive integer");
      }
      if (supplierId !== null && (!Number.isInteger(supplierId) || supplierId <= 0)) {
        throw new Error("Invalid supplierId: must be a positive integer");
      }
      if (dateFrom && isNaN(Date.parse(dateFrom))) {
        throw new Error("Invalid dateFrom: must be a valid date");
      }
      if (dateTo && isNaN(Date.parse(dateTo))) {
        throw new Error("Invalid dateTo: must be a valid date");
      }

      const queryParams = [
        pageNumber,
        pageSize,
        sortBy,
        sortOrder.toUpperCase(),
        customerId || null,
        companyId || null,
        supplierId || null,
        dateFrom || null,
        dateTo || null,
        searchTerm || null
      ];

      const [result] = await pool.query("CALL SP_GetAllSalesInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", queryParams);

      if (!result[0] || result[0].length === 0) {
        return {
          data: [],
          totalRecords: 0,
          totalPages: 0,
          currentPage: pageNumber,
          pageSize: pageSize
        };
      }

      return {
        data: result[0],
        totalRecords: result[0][0].TotalRecords,
        totalPages: result[0][0].TotalPages,
        currentPage: result[0][0].CurrentPage,
        pageSize: result[0][0].PageSize
      };
    } catch (err) {
      const errorMessage = err.sqlState
        ? `Database error: ${err.message} (SQLSTATE: ${err.sqlState})`
        : `Database error: ${err.message}`;
      throw new Error(errorMessage);
    }
  }

  // Get a single Sales Invoice by ID
  static async getSalesInvoiceById(id) {
    try {
      const pool = await poolPromise;

      // Validate id
      const salesInvoiceId = parseInt(id);
      if (isNaN(salesInvoiceId) || salesInvoiceId <= 0) {
        throw new Error("Invalid SalesInvoiceID: must be a positive integer");
      }

      const queryParams = [
        "SELECT",
        salesInvoiceId,
        null, // p_PInvoiceID
        null, // p_SalesRFQID
        null, // p_UserID
        null, // p_Series
        null, // p_ReferencedSalesInvoiceID
        null, // p_SalesOrderID
        null, // p_PostingDate
        null, // p_RequiredByDate
        null, // p_DeliveryDate
        null, // p_DateReceived
        null, // p_Terms
        null, // p_PackagingRequiredYN
        null, // p_CollectFromSupplierYN
        null, // p_ExternalRefNo
        null, // p_ExternalSupplierID
        null, // p_IsPaid
        null, // p_FormCompletedYN
        null, // p_FileName
        null, // p_FileContent
        null, // p_CopyTaxesFromPInvoice
        null, // p_TaxChargesTypeID
        null, // p_TaxRate
        null, // p_TaxTotal
        null, // p_OriginWarehouseAddressID
        null // p_DestinationWarehouseAddressID
      ];

      const [result] = await pool.query(
        "CALL SP_ManageSalesInvoiceDEV(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_ErrorMessage)",
        queryParams
      );

      const [[outParams]] = await pool.query("SELECT @p_ErrorMessage AS errorMessage");

      if (outParams.errorMessage) {
        throw new Error(outParams.errorMessage);
      }

      if (!result[0][0]) {
        throw new Error("Sales Invoice not found");
      }

      return result[0][0];
    } catch (err) {
      const errorMessage = err.sqlState
        ? `Database error: ${err.message} (SQLSTATE: ${err.sqlState})`
        : `Database error: ${err.message}`;
      throw new Error(errorMessage);
    }
  }

  // Create a Sales Invoice
  static async createSalesInvoice(data, userId) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        "INSERT",
        null, // p_SalesInvoiceID
        data.pInvoiceId || null,
        data.salesRFQId || null,
        userId,
        data.series || null,
        data.referencedSalesInvoiceId || null,
        data.salesOrderId || null,
        data.postingDate || null,
        data.requiredByDate || null,
        data.deliveryDate || null,
        data.dateReceived || null,
        data.terms || null,
        data.packagingRequiredYN || null,
        data.collectFromSupplierYN || null,
        data.externalRefNo || null,
        data.externalSupplierId || null,
        data.isPaid || null,
        data.formCompletedYN || null,
        data.fileName || null,
        data.fileContent || null,
        data.copyTaxesFromPInvoice || null,
        data.taxChargesTypeId || null,
        data.taxRate || null,
        data.taxTotal || null,
        data.originWarehouseAddressId || null,
        data.destinationWarehouseAddressId || null
      ];

      const [result] = await pool.query(
        "CALL SP_ManageSalesInvoiceDEV(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_ErrorMessage)",
        queryParams
      );

      const [[outParams]] = await pool.query("SELECT @p_ErrorMessage AS errorMessage");

      if (outParams.errorMessage) {
        throw new Error(outParams.errorMessage);
      }

      return {
        salesInvoiceId: result[0][0]?.SalesInvoiceID,
        message: result[0][0]?.Message || "Sales Invoice created successfully"
      };
    } catch (err) {
      const errorMessage = err.sqlState
        ? `Database error: ${err.message} (SQLSTATE: ${err.sqlState})`
        : `Database error: ${err.message}`;
      throw new Error(errorMessage);
    }
  }

  // Update a Sales Invoice
  static async updateSalesInvoice(id, data, userId) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        "UPDATE",
        id,
        data.pInvoiceId || null,
        data.salesRFQId || null,
        userId,
        data.series || null,
        data.referencedSalesInvoiceId || null,
        data.salesOrderId || null,
        data.postingDate || null,
        data.requiredByDate || null,
        data.deliveryDate || null,
        data.dateReceived || null,
        data.terms || null,
        data.packagingRequiredYN || null,
        data.collectFromSupplierYN || null,
        data.externalRefNo || null,
        data.externalSupplierId || null,
        data.isPaid || null,
        data.formCompletedYN || null,
        data.fileName || null,
        data.fileContent || null,
        data.copyTaxesFromPInvoice || null,
        data.taxChargesTypeId || null,
        data.taxRate || null,
        data.taxTotal || null,
        data.originWarehouseAddressId || null,
        data.destinationWarehouseAddressId || null
      ];

      const [result] = await pool.query(
        "CALL SP_ManageSalesInvoiceDEV(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_ErrorMessage)",
        queryParams
      );

      const [[outParams]] = await pool.query("SELECT @p_ErrorMessage AS errorMessage");

      if (outParams.errorMessage) {
        throw new Error(outParams.errorMessage);
      }

      return {
        message: result[0][0]?.Message || "Sales Invoice updated successfully"
      };
    } catch (err) {
      const errorMessage = err.sqlState
        ? `Database error: ${err.message} (SQLSTATE: ${err.sqlState})`
        : `Database error: ${err.message}`;
      throw new Error(errorMessage);
    }
  }

  // Delete a Sales Invoice
  static async deleteSalesInvoice(id, userId) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        "DELETE",
        id,
        null, // p_PInvoiceID
        null, // p_SalesRFQID
        userId,
        null, // p_Series
        null, // p_ReferencedSalesInvoiceID
        null, // p_SalesOrderID
        null, // p_PostingDate
        null, // p_RequiredByDate
        null, // p_DeliveryDate
        null, // p_DateReceived
        null, // p_Terms
        null, // p_PackagingRequiredYN
        null, // p_CollectFromSupplierYN
        null, // p_ExternalRefNo
        null, // p_ExternalRefNo
        null, // p_IsPaid
        null, // p_FormCompletedYN
        null, // p_FileName
        null, // p_FileContent
        null, // p_CopyTaxesFromPInvoice
        null, // p_TaxChargesTypeID
        null, // p_TaxRate
        null, // p_TaxTotal
        null, // p_OriginWarehouseAddressID
        null // p_DestinationWarehouseAddressID
      ];

      const [result] = await pool.query(
        "CALL SP_ManageSalesInvoiceDEV(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_ErrorMessage)",
        queryParams
      );

      const [[outParams]] = await pool.query("SELECT @p_ErrorMessage AS errorMessage");

      if (outParams.errorMessage) {
        throw new Error(outParams.errorMessage);
      }

      return {
        message: result[0][0]?.Message || "Sales Invoice deleted successfully"
      };
    } catch (err) {
      const errorMessage = err.sqlState
        ? `Database error: ${err.message} (SQLSTATE: ${err.sqlState})`
        : `Database error: ${err.message}`;
      throw new Error(errorMessage);
    }
  }

  // Helper: Check form role approver permission
  static async #checkFormRoleApproverPermission(approverID, formName) {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT fra.UserID
        FROM dbo_tblformroleapprover fra
        JOIN dbo_tblformrole fr ON fra.FormRoleID = fr.FormRoleID
        JOIN dbo_tblform f ON fr.FormID = f.FormID
        WHERE fra.UserID = ?
          AND f.FormName = ?
          AND fra.ActiveYN = 1
          AND f.IsDeleted = 0;
      `;
      const [result] = await pool.query(query, [parseInt(approverID), formName]);
      return result.length > 0;
    } catch (error) {
      throw new Error(`Error checking form role approver permission: ${error.message}`);
    }
  }

  // Helper: Check Sales Invoice status
  static async #checkSalesInvoiceStatus(SalesInvoiceID) {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT Status
        FROM dbo_tblsalesinvoice
        WHERE SalesInvoiceID = ? AND IsDeleted = 0;
      `;
      const [result] = await pool.query(query, [parseInt(SalesInvoiceID)]);
      if (result.length === 0) {
        return { exists: false, status: null };
      }
      return { exists: true, status: result[0].Status };
    } catch (error) {
      throw new Error(`Error checking SalesInvoice status: ${error.message}`);
    }
  }

  // Helper: Insert approval record
  static async #insertSalesInvoiceApproval(connection, approvalData) {
    try {
      const queryParams = [
        "INSERT",
        approvalData.SalesInvoiceID,
        approvalData.ApproverID,
        1, // ApprovedYN
        null, // ApproverDateTime (set to NOW() in SP)
        approvalData.ApproverID, // CreatedByID
        null // DeletedByID
      ];

      const [result] = await connection.query(
        "CALL SP_ManageSalesInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)",
        queryParams
      );

      const [[outParams]] = await connection.query("SELECT @p_Result AS result, @p_Message AS message");

      if (outParams.result !== 1) {
        throw new Error(outParams.message || "Failed to insert approval record");
      }

      return {
        success: true,
        message: outParams.message || "Approval record inserted successfully",
        insertId: result[0]?.insertId
      };
    } catch (error) {
      throw new Error(`Error inserting Sales Invoice approval: ${error.message}`);
    }
  }

  // Approve a Sales Invoice
  static async approveSalesInvoice(approvalData) {
    let connection;
    try {
      const pool = await poolPromise;
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const requiredFields = ["SalesInvoiceID", "ApproverID"];
      const missingFields = requiredFields.filter((field) => !approvalData[field]);
      if (missingFields.length > 0) {
        throw new Error(`${missingFields.join(", ")} are required`);
      }

      const SalesInvoiceID = parseInt(approvalData.SalesInvoiceID);
      const approverID = parseInt(approvalData.ApproverID);
      if (isNaN(SalesInvoiceID) || isNaN(approverID)) {
        throw new Error("Invalid SalesInvoiceID or ApproverID");
      }

      const formName = "Sales Invoice";
      const hasPermission = await this.#checkFormRoleApproverPermission(approverID, formName);
      if (!hasPermission) {
        throw new Error("Approver does not have permission to approve this form");
      }

      const { exists, status } = await this.#checkSalesInvoiceStatus(SalesInvoiceID);
      if (!exists) {
        throw new Error("Sales Invoice does not exist or has been deleted");
      }
      if (status !== "Pending") {
        throw new Error(`Sales Invoice status must be Pending to approve, current status: ${status}`);
      }

      const [existingApproval] = await connection.query(
        "SELECT 1 FROM dbo_tblsalesinvoiceapproval WHERE SalesInvoiceID = ? AND ApproverID = ? AND IsDeleted = 0",
        [SalesInvoiceID, approverID]
      );
      if (existingApproval.length > 0) {
        throw new Error("Approver has already approved this Sales Invoice");
      }

      const approvalInsertResult = await this.#insertSalesInvoiceApproval(connection, {
        SalesInvoiceID,
        ApproverID: approverID
      });
      if (!approvalInsertResult.success) {
        throw new Error(`Failed to insert approval record: ${approvalInsertResult.message}`);
      }

      const [form] = await connection.query(
        "SELECT FormID FROM dbo_tblform WHERE FormName = ? AND IsDeleted = 0",
        [formName]
      );
      if (!form.length) {
        throw new Error("Invalid FormID for Sales Invoice");
      }
      const formID = form[0].FormID;

      const [requiredApproversList] = await connection.query(
        `SELECT DISTINCT fra.UserID, p.FirstName
         FROM dbo_tblformroleapprover fra
         JOIN dbo_tblformrole fr ON fra.FormRoleID = fr.FormRoleID
         JOIN dbo_tblperson p ON fra.UserID = p.PersonID
         WHERE fr.FormID = ? AND fra.ActiveYN = 1`,
        [formID]
      );
      const requiredCount = requiredApproversList.length;

      const [approvedList] = await connection.query(
        `SELECT s.ApproverID, s.ApprovedYN
         FROM dbo_tblsalesinvoiceapproval s
         WHERE s.SalesInvoiceID = ? AND s.IsDeleted = 0
           AND s.ApproverID IN (
             SELECT DISTINCT fra.UserID
             FROM dbo_tblformroleapprover fra
             JOIN dbo_tblformrole fr ON fra.FormRoleID = fr.FormRoleID
             WHERE fr.FormID = ? AND fra.ActiveYN = 1
           )`,
        [SalesInvoiceID, formID]
      );
      const approved = approvedList.filter((a) => a.ApprovedYN === 1).length;

      const [allApprovals] = await connection.query(
        "SELECT ApproverID FROM dbo_tblsalesinvoiceapproval WHERE SalesInvoiceID = ? AND IsDeleted = 0",
        [SalesInvoiceID]
      );
      const requiredUserIDs = requiredApproversList.map((a) => a.UserID);
      const mismatchedApprovals = allApprovals.filter((a) => !requiredUserIDs.includes(a.ApproverID));

      console.log(
        `Approval Debug: SalesInvoiceID=${SalesInvoiceID}, FormID=${formID}, RequiredApprovers=${requiredCount}, Approvers=${JSON.stringify(
          requiredApproversList
        )}, CompletedApprovals=${approved}, ApprovedList=${JSON.stringify(
          approvedList
        )}, CurrentApproverID=${approverID}, MismatchedApprovals=${JSON.stringify(
          mismatchedApprovals
        )}`
      );

      let message;
      let isFullyApproved = false;

      if (approved >= requiredCount) {
        await connection.query(
          "UPDATE dbo_tblsalesinvoice SET Status = ? WHERE SalesInvoiceID = ?",
          ["Approved", SalesInvoiceID]
        );
        message = "Sales Invoice fully approved.";
        isFullyApproved = true;
      } else {
        const remaining = requiredCount - approved;
        message = `Approval recorded. Awaiting ${remaining} more approval(s).`;
      }

      await connection.commit();

      return {
        success: true,
        message,
        data: null,
        SalesInvoiceID: SalesInvoiceID.toString(),
        newSalesInvoiceID: null,
        isFullyApproved
      };
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error("Database error in approveSalesInvoice:", error);
      return {
        success: false,
        message: `Approval failed: ${error.message || "Unknown error"}`,
        data: null,
        SalesInvoiceID: approvalData.SalesInvoiceID?.toString() || null,
        newSalesInvoiceID: null
      };
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = SalesInvoiceModel;