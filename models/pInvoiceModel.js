const poolPromise = require('../config/db.config');

class PInvoiceModel {
  // Get paginated Purchase Invoices
  static async getAllPInvoices({ pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10
      ];

      // Call SP_GetAllPInvoices (assuming this exists)
      const [result] = await pool.query(
        'CALL SP_GetAllPInvoices(?, ?, @totalRecords)',
        queryParams
      );

      // Retrieve OUT parameter
      const [[{ totalRecords }]] = await pool.query('SELECT @totalRecords AS totalRecords');

      return {
        data: result[0],
        totalRecords: totalRecords || 0
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Purchase Invoice
  static async createPInvoice(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_PInvoiceID
        data.POID,
        data.UserID,
        data.Series || null,
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
        null  // p_FileContent
      ];

      // Call SP_ManagePInvoice
      const [result] = await pool.query(
        'CALL SP_ManagePInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      const response = result[0][0];
      
      if (response.Status !== 'SUCCESS') {
        throw new Error(response.Message || 'Failed to create Purchase Invoice');
      }

      return {
        newPInvoiceId: response.PInvoiceID,
        message: response.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Purchase Invoice by ID
  static async getPInvoiceById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_POID
        null, // p_UserID
        null, // p_Series
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
        null  // p_FileContent
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Purchase Invoice
  static async updatePInvoice(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        null, // p_POID (not updatable)
        data.UserID,
        null, // p_Series (not updatable)
        data.PostingDate || null,
        data.RequiredByDate || null,
        data.DeliveryDate || null,
        data.DateReceived || null,
        data.Terms || null,
        data.PackagingRequiredYN !== undefined ? data.PackagingRequiredYN : null,
        data.CollectFromSupplierYN !== undefined ? data.CollectFromSupplierYN : null,
        data.ExternalRefNo || null,
        data.ExternalSupplierID || null,
        data.IsPaid !== undefined ? data.IsPaid : null,
        data.FormCompletedYN !== undefined ? data.FormCompletedYN : null,
        data.FileName || null,
        data.FileContent || null
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      const response = result[0][0];
      
      if (response.Status !== 'SUCCESS') {
        throw new Error(response.Message || 'Failed to update Purchase Invoice');
      }

      return {
        message: response.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Purchase Invoice
  static async deletePInvoice(id, deletedById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_POID
        deletedById,
        null, // p_Series
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
        null  // p_FileContent
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      const response = result[0][0];
      
      if (response.Status !== 'SUCCESS') {
        throw new Error(response.Message || 'Failed to delete Purchase Invoice');
      }

      return {
        message: response.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Mark invoice as paid
  static async markAsPaid(id, userId) {
    try {
      const updateData = {
        IsPaid: 1,
        UserID: userId
      };

      return await this.updatePInvoice(id, updateData);
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Mark form as completed
  static async markFormCompleted(id, userId) {
    try {
      const updateData = {
        FormCompletedYN: 1,
        UserID: userId
      };

      return await this.updatePInvoice(id, updateData);
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

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

  static async #checkPInvoiceStatus(pInvoiceID) {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT Status 
        FROM dbo_tblpinvoice 
        WHERE PInvoiceID = ? AND IsDeleted = 0;
      `;
      const [result] = await pool.query(query, [parseInt(pInvoiceID)]);
      if (result.length === 0) {
        return { exists: false, status: null };
      }
      return { exists: true, status: result[0].Status };
    } catch (error) {
      throw new Error(`Error checking PInvoice status: ${error.message}`);
    }
  }

  static async #insertPInvoiceApproval(connection, approvalData) {
    try {
      const query = `
        INSERT INTO dbo_tblpinvoiceapproval (
          PInvoiceID, ApproverID, ApprovedYN, ApproverDateTime, CreatedByID, CreatedDateTime, IsDeleted
        ) VALUES (
          ?, ?, ?, NOW(), ?, NOW(), 0
        );
      `;
      const [result] = await connection.query(query, [
        parseInt(approvalData.PInvoiceID),
        parseInt(approvalData.ApproverID),
        1,
        parseInt(approvalData.ApproverID)
      ]);
      console.log(`Insert Debug: PInvoiceID=${approvalData.PInvoiceID}, ApproverID=${approvalData.ApproverID}, InsertedID=${result.insertId}`);
      return { success: true, message: 'Approval record inserted successfully.', insertId: result.insertId };
    } catch (error) {
      throw new Error(`Error inserting PInvoice approval: ${error.message}`);
    }
  }

  static async approvePInvoice(approvalData) {
    let connection;
    try {
      const pool = await poolPromise;
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const requiredFields = ['PInvoiceID', 'ApproverID'];
      const missingFields = requiredFields.filter(field => !approvalData[field]);
      if (missingFields.length > 0) {
        throw new Error(`${missingFields.join(', ')} are required`);
      }

      const pInvoiceID = parseInt(approvalData.PInvoiceID);
      const approverID = parseInt(approvalData.ApproverID);
      if (isNaN(pInvoiceID) || isNaN(approverID)) {
        throw new Error('Invalid PInvoiceID or ApproverID');
      }

      const formName = 'PInvoice';
      const hasPermission = await this.#checkFormRoleApproverPermission(approverID, formName);
      if (!hasPermission) {
        throw new Error('Approver does not have permission to approve this form');
      }

      const { exists, status } = await this.#checkPInvoiceStatus(pInvoiceID);
      if (!exists) {
        throw new Error('PInvoice does not exist or has been deleted');
      }
      if (status !== 'Pending') {
        throw new Error(`PInvoice status must be Pending to approve, current status: ${status}`);
      }

      // Check for existing approval
      const [existingApproval] = await connection.query(
        'SELECT 1 FROM dbo_tblpinvoiceapproval WHERE PInvoiceID = ? AND ApproverID = ? AND IsDeleted = 0',
        [pInvoiceID, approverID]
      );
      if (existingApproval.length > 0) {
        throw new Error('Approver has already approved this PInvoice');
      }

      // Record approval within the same transaction
      const approvalInsertResult = await this.#insertPInvoiceApproval(connection, { PInvoiceID: pInvoiceID, ApproverID: approverID });
      if (!approvalInsertResult.success) {
        throw new Error(`Failed to insert approval record: ${approvalInsertResult.message}`);
      }

      // Get FormID
      const [form] = await connection.query(
        'SELECT FormID FROM dbo_tblform WHERE FormName = ? AND IsDeleted = 0',
        [formName]
      );
      if (!form.length) {
        throw new Error('Invalid FormID for PInvoice');
      }
      const formID = form[0].FormID;

      // Get required approvers (distinct UserID)
      const [requiredApproversList] = await connection.query(
        `SELECT DISTINCT fra.UserID, p.FirstName
         FROM dbo_tblformroleapprover fra
         JOIN dbo_tblformrole fr ON fra.FormRoleID = fr.FormRoleID
         JOIN dbo_tblperson p ON fra.UserID = p.PersonID
         WHERE fr.FormID = ? AND fra.ActiveYN = 1`,
        [formID]
      );
      const requiredCount = requiredApproversList.length;

      // Get completed approvals, only counting those from required approvers
      const [approvedList] = await connection.query(
        `SELECT s.ApproverID, s.ApprovedYN
         FROM dbo_tblpinvoiceapproval s
         WHERE s.PInvoiceID = ? AND s.IsDeleted = 0
           AND s.ApproverID IN (
             SELECT DISTINCT fra.UserID 
             FROM dbo_tblformroleapprover fra 
             JOIN dbo_tblformrole fr ON fra.FormRoleID = fr.FormRoleID 
             WHERE fr.FormID = ? AND fra.ActiveYN = 1
           )`,
        [pInvoiceID, formID]
      );
      const approved = approvedList.filter(a => a.ApprovedYN === 1).length;

      // Check for mismatched ApproverIDs
      const [allApprovals] = await connection.query(
        'SELECT ApproverID FROM dbo_tblpinvoiceapproval WHERE PInvoiceID = ? AND IsDeleted = 0',
        [pInvoiceID]
      );
      const requiredUserIDs = requiredApproversList.map(a => a.UserID);
      const mismatchedApprovals = allApprovals.filter(a => !requiredUserIDs.includes(a.ApproverID));

      // Debug logs
      console.log(`Approval Debug: PInvoiceID=${pInvoiceID}, FormID=${formID}, RequiredApprovers=${requiredCount}, Approvers=${JSON.stringify(requiredApproversList)}, CompletedApprovals=${approved}, ApprovedList=${JSON.stringify(approvedList)}, CurrentApproverID=${approverID}, MismatchedApprovals=${JSON.stringify(mismatchedApprovals)}`);

      let message;
      let isFullyApproved = false;

      if (approved >= requiredCount) {
        // All approvals complete
        await connection.query(
          'UPDATE dbo_tblpinvoice SET Status = ? WHERE PInvoiceID = ?',
          ['Approved', pInvoiceID]
        );
        message = 'PInvoice fully approved.';
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
        pInvoiceId: pInvoiceID.toString(),
        newPInvoiceId: null,
        isFullyApproved
      };
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Database error in approvePInvoice:', error);
      return {
        success: false,
        message: `Approval failed: ${error.message || 'Unknown error'}`,
        data: null,
        pInvoiceId: approvalData.PInvoiceID.toString(),
        newPInvoiceId: null
      };
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = PInvoiceModel;