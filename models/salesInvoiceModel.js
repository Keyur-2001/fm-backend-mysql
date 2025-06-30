const poolPromise = require('../config/db.config');

class SalesInvoiceModel {
  // Get all Sales Invoices
  static async getAllSalesInvoices({
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'CreatedDateTime',
    sortOrder = 'DESC',
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
        throw new Error('Invalid pageNumber: must be a positive integer');
      }
      if (!Number.isInteger(pageSize) || pageSize <= 0) {
        throw new Error('Invalid pageSize: must be a positive integer');
      }
      if (!['CreatedDateTime', 'PostingDate', 'DeliveryDate', 'RequiredByDate', 'Series', 'Total'].includes(sortBy)) {
        throw new Error('Invalid sortBy: must be one of CreatedDateTime, PostingDate, DeliveryDate, RequiredByDate, Series, Total');
      }
      if (!['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
        throw new Error('Invalid sortOrder: must be ASC or DESC');
      }

      const queryParams = [
        pageNumber,
        pageSize,
        sortBy,
        sortOrder.toUpperCase(),
        customerId ? parseInt(customerId) : null,
        companyId ? parseInt(companyId) : null,
        supplierId ? parseInt(supplierId) : null,
        dateFrom || null,
        dateTo || null,
        searchTerm || null
      ];

      const [result] = await pool.query(
        'CALL SP_GetAllSalesInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      return {
        data: result[0],
        totalRecords: result[0][0]?.TotalRecords || 0,
        totalPages: result[0][0]?.TotalPages || 0,
        currentPage: result[0][0]?.CurrentPage || pageNumber,
        pageSize: result[0][0]?.PageSize || pageSize
      };
    } catch (err) {
      const errorMessage = err.sqlState ? 
        `Database error: ${err.message} (SQLSTATE: ${err.sqlState})` : 
        `Database error: ${err.message}`;
      throw new Error(errorMessage);
    }
  }

  // Create a Sales Invoice
  static async createSalesInvoice(data, userId) {
    try {
      const pool = await poolPromise;

    const queryParams = [
        'INSERT',
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
        data.packagingRequiredYN || 0,
        data.collectFromSupplierYN || 0,
        data.externalRefNo || null,
        data.externalSupplierId || null,
        data.isPaid || 0, // Added missing parameter
        data.formCompletedYN || 0,
        data.fileName || null, // Added missing parameter
        data.fileContent || null, // Added missing parameter
        data.copyTaxesFromPInvoice || 0,
        data.taxChargesTypeId || null,
        data.taxRate || null,
        data.taxTotal || null,
        data.originWarehouseAddressId || null,
        data.destinationWarehouseAddressId || null
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSalesInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_ErrorMessage)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_ErrorMessage AS errorMessage'
      );

      if (outParams?.errorMessage || result[0][0]?.Status === 'FAILED') {
        // Check error log for more details
        await new Promise(resolve => setTimeout(resolve, 100));
        const [[errorLog]] = await pool.query(
          'SELECT ErrorMessage, CreatedAt FROM dbo_tblerrorlog ORDER BY CreatedAt DESC LIMIT 1'
        );
        throw new Error(`Stored procedure error: ${errorLog?.ErrorMessage || outParams?.errorMessage || result[0][0]?.Message || 'Unknown error'}`);
      }

      return {
        salesInvoiceId: result[0][0]?.SalesInvoiceID,
        message: result[0][0]?.Message || 'Sales Invoice created successfully'
      };
    } catch (err) {
      const errorMessage = err.sqlState ? 
        `Database error: ${err.message} (SQLSTATE: ${err.sqlState})` : 
        `Database error: ${err.message}`;
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

  // Helper: Check Supplier Quotation status
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
      const query = `
        INSERT INTO dbo_tblsalesinvoiceapproval (
         SalesInvoiceID, ApproverID, ApprovedYN, ApproverDateTime, CreatedByID, CreatedDateTime, IsDeleted
        ) VALUES (
          ?, ?, ?, NOW(), ?, NOW(), 0
        );
      `;
      const [result] = await connection.query(query, [
        parseInt(approvalData.SalesInvoiceID),
        parseInt(approvalData.ApproverID),
        1,
        parseInt(approvalData.ApproverID)
      ]);
      console.log(`Insert Debug: SalesInvoiceID=${approvalData.SalesInvoiceID}, ApproverID=${approvalData.ApproverID}, InsertedID=${result.insertId}`);
      return { success: true, message: 'Approval record inserted successfully.', insertId: result.insertId };
    } catch (error) {
      throw new Error(`Error inserting Purchase Invoice approval: ${error.message}`);
    }
  }

  // Approve a Supplier Quotation
  static async approveSalesInvoice(approvalData) {
    let connection;
    try {
      const pool = await poolPromise;
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const requiredFields = ['SalesInvoiceID', 'ApproverID'];
      const missingFields = requiredFields.filter(field => !approvalData[field]);
      if (missingFields.length > 0) {
        throw new Error(`${missingFields.join(', ')} are required`);
      }

      const SalesInvoiceID = parseInt(approvalData.SalesInvoiceID);
      const approverID = parseInt(approvalData.ApproverID);
      if (isNaN(SalesInvoiceID) || isNaN(approverID)) {
        throw new Error('Invalid SalesInvoiceID or ApproverID');
      }

      const formName = 'Sales Invoice';
      const hasPermission = await this.#checkFormRoleApproverPermission(approverID, formName);
      if (!hasPermission) {
        throw new Error('Approver does not have permission to approve this form');
      }

      const { exists, status } = await this.#checkSalesInvoiceStatus(SalesInvoiceID);
      if (!exists) {
        throw new Error('Sales Invoice does not exist or has been deleted');
      }
      if (status !== 'Pending') {
        throw new Error(`Sales Invoice status must be Pending to approve, current status: ${status}`);
      }

      // Check for existing approval
      const [existingApproval] = await connection.query(
        'SELECT 1 FROM dbo_tblsalesinvoiceapproval WHERE SalesInvoiceID = ? AND ApproverID = ? AND IsDeleted = 0',
        [SalesInvoiceID, approverID]
      );
      if (existingApproval.length > 0) {
        throw new Error('Approver has already approved this Sales Invoice');
      }

      // Record approval
      const approvalInsertResult = await this.#insertSalesInvoiceApproval(connection, { SalesInvoiceID: SalesInvoiceID, ApproverID: approverID });
      if (!approvalInsertResult.success) {
        throw new Error(`Failed to insert approval record: ${approvalInsertResult.message}`);
      }

      // Get FormID
      const [form] = await connection.query(
        'SELECT FormID FROM dbo_tblform WHERE FormName = ? AND IsDeleted = 0',
        [formName]
      );
      if (!form.length) {
        throw new Error('Invalid FormID for Sales Invoice');
      }
      const formID = form[0].FormID;

      // Get required approvers
      const [requiredApproversList] = await connection.query(
        `SELECT DISTINCT fra.UserID, p.FirstName
         FROM dbo_tblformroleapprover fra
         JOIN dbo_tblformrole fr ON fra.FormRoleID = fr.FormRoleID
         JOIN dbo_tblperson p ON fra.UserID = p.PersonID
         WHERE fr.FormID = ? AND fra.ActiveYN = 1`,
        [formID]
      );
      const requiredCount = requiredApproversList.length;

      // Get completed approvals
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
      const approved = approvedList.filter(a => a.ApprovedYN === 1).length;

      // Check for mismatched ApproverIDs
      const [allApprovals] = await connection.query(
        'SELECT ApproverID FROM dbo_tblsalesinvoiceapproval WHERE SalesInvoiceID = ? AND IsDeleted = 0',
        [SalesInvoiceID]
      );
      const requiredUserIDs = requiredApproversList.map(a => a.UserID);
      const mismatchedApprovals = allApprovals.filter(a => !requiredUserIDs.includes(a.ApproverID));

      // Debug logs
      console.log(`Approval Debug: SalesInvoiceID=${SalesInvoiceID}, FormID=${formID}, RequiredApprovers=${requiredCount}, Approvers=${JSON.stringify(requiredApproversList)}, CompletedApprovals=${approved}, ApprovedList=${JSON.stringify(approvedList)}, CurrentApproverID=${approverID}, MismatchedApprovals=${JSON.stringify(mismatchedApprovals)}`);

      let message;
      let isFullyApproved = false;

      if (approved >= requiredCount) {
        // All approvals complete
        await connection.query(
          'UPDATE dbo_tblsalesinvoice SET Status = ? WHERE SalesInvoiceID = ?',
          ['Approved', SalesInvoiceID]
        );
        message = 'Sales Invoice fully approved.';
        isFullyApproved = true;
      } else {
        // Partial approval
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
      console.error('Database error in approveSalesInvoice:', error);
      return {
        success: false,
        message: `Approval failed: ${error.message || 'Unknown error'}`,
        data: null,
        SalesInvoiceID: approvalData.SalesInvoiceID.toString(),
        newSalesInvoiceID: null
      };
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // Helper: Insert approval record
  static async #insertSalesInvoiceApproval(connection, approvalData) {
    try {
      const query = `
        INSERT INTO dbo_tblsalesinvoiceapproval (
         SalesInvoiceID, ApproverID, ApprovedYN, ApproverDateTime, CreatedByID, CreatedDateTime, IsDeleted
        ) VALUES (
          ?, ?, ?, NOW(), ?, NOW(), 0
        );
      `;
      const [result] = await connection.query(query, [
        parseInt(approvalData.SalesInvoiceID),
        parseInt(approvalData.ApproverID),
        1,
        parseInt(approvalData.ApproverID)
      ]);
      console.log(`Insert Debug: SalesInvoiceID=${approvalData.SalesInvoiceID}, ApproverID=${approvalData.ApproverID}, InsertedID=${result.insertId}`);
      return { success: true, message: 'Approval record inserted successfully.', insertId: result.insertId };
    } catch (error) {
      throw new Error(`Error inserting Sales Invoice approval: ${error.message}`);
    }
  }
     static async getSalesInvoiceApprovalStatus(SalesInvoiceID) {
    try {
      const pool = await poolPromise;
      const formName = 'Sales Invoice';

      // Get FormID
      const [form] = await pool.query(
        'SELECT FormID FROM dbo_tblform WHERE FormName = ? AND IsDeleted = 0',
        [formName]
      );
      if (!form.length) {
        throw new Error('Invalid FormID for Purchase Invoice');
      }
      const formID = form[0].FormID;

      // Get required approvers
      const [requiredApprovers] = await pool.query(
        `SELECT DISTINCT fra.UserID, p.FirstName, p.LastName
         FROM dbo_tblformroleapprover fra
         JOIN dbo_tblformrole fr ON fra.FormRoleID = fr.FormRoleID
         JOIN dbo_tblperson p ON fra.UserID = p.PersonID
         WHERE fr.FormID = ? AND fra.ActiveYN = 1 AND p.IsDeleted = 0`,
        [formID]
      );

      // Get completed approvals
      const [completedApprovals] = await pool.query(
        `SELECT s.ApproverID, p.FirstName, p.LastName, s.ApproverDateTime
         FROM dbo_tblsalesinvoiceapproval s
         JOIN dbo_tblperson p ON s.ApproverID = p.PersonID
         WHERE s.SalesInvoiceID = ? AND s.IsDeleted = 0 AND s.ApprovedYN = 1
         AND s.ApproverID IN (
           SELECT DISTINCT fra.UserID 
           FROM dbo_tblformroleapprover fra 
           JOIN dbo_tblformrole fr ON fra.FormRoleID = fr.FormRoleID 
           WHERE fr.FormID = ? AND fra.ActiveYN = 1
         )`,
        [parseInt(SalesInvoiceID), formID]
      );

      // Prepare approval status
      const approvalStatus = requiredApprovers.map(approver => ({
        UserID: approver.UserID,
        FirstName: approver.FirstName,
        LastName: approver.LastName,
        Approved: completedApprovals.some(a => a.ApproverID === approver.UserID),
        ApproverDateTime: completedApprovals.find(a => a.ApproverID === approver.UserID)?.ApproverDateTime || null
      }));

      return {
        success: true,
        message: 'Approval status retrieved successfully',
        data: {
          SalesInvoiceID,
          requiredApprovers: requiredApprovers.length,
          completedApprovals: completedApprovals.length,
          approvalStatus
        },
        SalesInvoiceID: SalesInvoiceID.toString(),
        newSalesInvoiceID: null
      };
    } catch (error) {
      console.error('Error in getSalesInvoiceApprovalStatus:', error);
      throw new Error(`Error retrieving approval status: ${error.message}`);
    }
  }

}

module.exports = SalesInvoiceModel;