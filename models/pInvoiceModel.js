const poolPromise = require("../config/db.config");

class PInvoiceModel {
  // Get paginated Purchase Invoices
  static async getAllPInvoices({
    pageNumber = 1,
    pageSize = 10,
    fromDate = null,
    toDate = null,
  }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null,
      ];

      // Log query parameters
      console.log("getAllPInvoices params:", queryParams);

      // Call SP_GetAllPInvoice with session variables for OUT parameters
      const [results] = await pool.query(
        "CALL SP_GetAllPInvoice(?, ?, ?, ?, @p_Result, @p_Message)",
        queryParams
      );

      // Log results
      console.log("getAllPInvoices results:", JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query(
        "SELECT @p_Result AS p_Result, @p_Message AS p_Message"
      );

      // Log output
      console.log("getAllPInvoices output:", JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === "undefined") {
        throw new Error("Output parameters missing from SP_GetAllPInvoice");
      }

      if (output[0].p_Result !== 1) {
        throw new Error(
          output[0].p_Message || "Failed to retrieve Purchase Invoices"
        );
      }

      return {
        data: results[0] || [],
        totalRecords: null, // SP does not return total count
      };
    } catch (err) {
      console.error("getAllPInvoices error:", JSON.stringify(err, null, 2));
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Purchase Invoice
  static async createPInvoice(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        "INSERT",
        null, // p_PInvoiceID
        data.POID,
        data.UserID,
        data.Series || null,
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
        data.FileContent || null,
        data.CopyTaxesFromPO !== undefined ? data.CopyTaxesFromPO : null,
        data.TaxChargesTypeID || null,
        data.TaxRate || null,
        data.TaxTotal || null,
        data.OriginWarehouseAddressID || null,
        data.DestinationWarehouseAddressID || null,
      ];

      // Call SP_ManagePInvoice with session variables for OUT parameter
      const [result] = await pool.query(
        "CALL SP_ManagePInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_ErrorMessage)",
        queryParams
      );

      // Fetch output parameter
      const [output] = await pool.query(
        "SELECT @p_ErrorMessage AS p_ErrorMessage"
      );

      const response = result[0][0];

      if (response.Status !== "SUCCESS") {
        throw new Error(
          response.Message ||
            output[0]?.p_ErrorMessage ||
            "Failed to create Purchase Invoice"
        );
      }

      return {
        newPInvoiceId: response.PInvoiceID,
        message: response.Message,
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
        "SELECT",
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
        null, // p_FileContent
        null, // p_CopyTaxesFromPO
        null, // p_TaxChargesTypeID
        null, // p_TaxRate
        null, // p_TaxTotal
        null, // p_OriginWarehouseAddressID
        null, // p_DestinationWarehouseAddressID
      ];

      const [result] = await pool.query(
        "CALL SP_ManagePInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_ErrorMessage)",
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
        "UPDATE",
        id,
        null, // p_POID (not updatable)
        data.UserID,
        null, // p_Series (not updatable)
        data.PostingDate || null,
        data.RequiredByDate || null,
        data.DeliveryDate || null,
        data.DateReceived || null,
        data.Terms || null,
        data.PackagingRequiredYN !== undefined
          ? data.PackagingRequiredYN
          : null,
        data.CollectFromSupplierYN !== undefined
          ? data.CollectFromSupplierYN
          : null,
        data.ExternalRefNo || null,
        data.ExternalSupplierID || null,
        data.IsPaid !== undefined ? data.IsPaid : null,
        data.FormCompletedYN !== undefined ? data.FormCompletedYN : null,
        data.FileName || null,
        data.FileContent || null,
        null, // p_CopyTaxesFromPO (not applicable for updates)
        null, // p_TaxChargesTypeID (not applicable for updates)
        null, // p_TaxRate (not applicable for updates)
        null, // p_TaxTotal (not applicable for updates)
        data.OriginWarehouseAddressID || null,
        data.DestinationWarehouseAddressID || null,
      ];

      const [result] = await pool.query(
        "CALL SP_ManagePInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_ErrorMessage)",
        queryParams
      );

      // Fetch output parameter
      const [output] = await pool.query(
        "SELECT @p_ErrorMessage AS p_ErrorMessage"
      );

      const response = result[0][0];

      if (response.Status !== "SUCCESS") {
        throw new Error(
          response.Message ||
            output[0]?.p_ErrorMessage ||
            "Failed to update Purchase Invoice"
        );
      }

      return {
        message: response.Message,
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
        "DELETE",
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
        null, // p_FileContent
        null, // p_CopyTaxesFromPO
        null, // p_TaxChargesTypeID
        null, // p_TaxRate
        null, // p_TaxTotal
        null, // p_OriginWarehouseAddressID
        null, // p_DestinationWarehouseAddressID
      ];

      const [result] = await pool.query(
        "CALL SP_ManagePInvoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_ErrorMessage)",
        queryParams
      );

      // Fetch output parameter
      const [output] = await pool.query(
        "SELECT @p_ErrorMessage AS p_ErrorMessage"
      );

      const response = result[0][0];

      if (response.Status !== "SUCCESS") {
        throw new Error(
          response.Message ||
            output[0]?.p_ErrorMessage ||
            "Failed to delete Purchase Invoice"
        );
      }

      return {
        message: response.Message,
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
        UserID: userId,
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
        UserID: userId,
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
      const [result] = await pool.query(query, [
        parseInt(approverID),
        formName,
      ]);
      return result.length > 0;
    } catch (error) {
      throw new Error(
        `Error checking form role approver permission: ${error.message}`
      );
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
        parseInt(approvalData.ApproverID),
      ]);
      console.log(
        `Insert Debug: PInvoiceID=${approvalData.PInvoiceID}, ApproverID=${approvalData.ApproverID}, InsertedID=${result.insertId}`
      );
      return {
        success: true,
        message: "Approval record inserted successfully.",
        insertId: result.insertId,
      };
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

      const requiredFields = ["PInvoiceID", "ApproverID"];
      const missingFields = requiredFields.filter(
        (field) => !approvalData[field]
      );
      if (missingFields.length > 0) {
        throw new Error(`${missingFields.join(", ")} are required`);
      }

      const pInvoiceID = parseInt(approvalData.PInvoiceID);
      const approverID = parseInt(approvalData.ApproverID);
      if (isNaN(pInvoiceID) || isNaN(approverID)) {
        throw new Error("Invalid PInvoiceID or ApproverID");
      }

      const formName = "PInvoice";
      const hasPermission = await this.#checkFormRoleApproverPermission(
        approverID,
        formName
      );
      if (!hasPermission) {
        throw new Error(
          "Approver does not have permission to approve this form"
        );
      }

      const { exists, status } = await this.#checkPInvoiceStatus(pInvoiceID);
      if (!exists) {
        throw new Error("PInvoice does not exist or has been deleted");
      }
      if (status !== "Pending") {
        throw new Error(
          `PInvoice status must be Pending to approve, current status: ${status}`
        );
      }

      // Check for existing approval
      const [existingApproval] = await connection.query(
        "SELECT 1 FROM dbo_tblpinvoiceapproval WHERE PInvoiceID = ? AND ApproverID = ? AND IsDeleted = 0",
        [pInvoiceID, approverID]
      );
      if (existingApproval.length > 0) {
        throw new Error("Approver has already approved this PInvoice");
      }

      // Record approval within the same transaction
      const approvalInsertResult = await this.#insertPInvoiceApproval(
        connection,
        { PInvoiceID: pInvoiceID, ApprovedFromSupplierYN: 0,
        ApproverID: approverID }
      );
      if (!approvalInsertResult.success) {
        throw new Error(
          `Failed to insert approval record: ${approvalInsertResult.message}`
        );
      }

      // Get FormID
      const [form] = await connection.query(
        "SELECT FormID FROM dbo_tblform WHERE FormName = ? AND IsDeleted = 0",
        [formName]
      );
      if (!form.length) {
        throw new Error("Invalid FormID for PInvoice");
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
      const approved = approvedList.filter((a) => a.ApprovedYN === 1).length;

      // Check for mismatched ApproverIDs
      const [allApprovals] = await connection.query(
        "SELECT ApproverID FROM dbo_tblpinvoiceapproval WHERE PInvoiceID = ? AND IsDeleted = 0",
        [pInvoiceID]
      );
      const requiredUserIDs = requiredApproversList.map((a) => a.UserID);
      const mismatchedApprovals = allApprovals.filter(
        (a) => !requiredUserIDs.includes(a.ApproverID)
      );

      // Debug logs
      console.log(
        `Approval Debug: PInvoiceID=${pInvoiceID}, FormID=${formID}, RequiredApprovers=${requiredCount}, Approvers=${JSON.stringify(
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
        // All approvals complete
        await connection.query(
          "UPDATE dbo_tblpinvoice SET Status = ? WHERE PInvoiceID = ?",
          ["Approved", pInvoiceID]
        );
        message = "PInvoice fully approved.";
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
        isFullyApproved,
      };
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error("Database error in approvePInvoice:", error);
      return {
        success: false,
        message: `Approval failed: ${error.message || "Unknown error"}`,
        data: null,
        pInvoiceId: approvalData.PInvoiceID.toString(),
        newPInvoiceId: null,
      };
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // Get all approvals for a Purchase Invoice
  static async getAllPInvoiceApprovals(pInvoiceId) {
    try {
      const pool = await poolPromise;

      if (!pInvoiceId || isNaN(parseInt(pInvoiceId))) {
        throw new Error("Valid PInvoiceID is required");
      }

      const query = `
        SELECT 
          pia.PInvoiceID,
          pia.ApproverID,
          p.FirstName AS ApproverName,
          pia.ApprovedYN,
          pia.ApproverDateTime,
          pia.CreatedByID,
          pia.CreatedDateTime,
          pia.IsDeleted
        FROM dbo_tblpinvoiceapproval pia
        JOIN dbo_tblperson p ON pia.ApproverID = p.PersonID
        WHERE pia.PInvoiceID = ? AND pia.IsDeleted = 0;
      `;

      const [result] = await pool.query(query, [parseInt(pInvoiceId)]);

      if (result.length === 0) {
        return {
          success: true,
          message: "No approval records found for this PInvoice",
          data: [],
          pInvoiceId: pInvoiceId.toString(),
        };
      }

      return {
        success: true,
        message: "Approval records retrieved successfully",
        data: result,
        pInvoiceId: pInvoiceId.toString(),
      };
    } catch (err) {
      console.error(
        "getAllPInvoiceApprovals error:",
        JSON.stringify(err, null, 2)
      );
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = PInvoiceModel;