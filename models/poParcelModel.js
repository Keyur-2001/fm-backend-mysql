const poolPromise = require('../config/db.config');

class POParcelModel {
  static async #executeManageStoredProcedure(action, poParcelData) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        action,
        poParcelData.POParcelID ? parseInt(poParcelData.POParcelID) : null,
        poParcelData.ItemQuantity ? parseFloat(poParcelData.ItemQuantity) : null,
        poParcelData.Rate ? parseFloat(poParcelData.Rate) : null,
        poParcelData.Amount ? parseFloat(poParcelData.Amount) : null,
        poParcelData.UOMID ? parseInt(poParcelData.UOMID) : null,
        poParcelData.CertificationID ? parseInt(poParcelData.CertificationID) : null,
        poParcelData.CreatedByID ? parseInt(poParcelData.CreatedByID) : null
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePOParcel(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      return {
        success: outParams.result === 1,
        message: outParams.message || (outParams.result === 1 ? `${action} operation successful` : 'Operation failed'),
        data: action === 'SELECT' ? result[0] || [] : null,
        poParcelId: poParcelData.POParcelID
      };
    } catch (error) {
      console.error(`Database error in ${action} operation:`, error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #validateForeignKeys(poParcelData, action) {
    const pool = await poolPromise;
    const errors = [];

    if (['UPDATE', 'DELETE'].includes(action)) {
      if (poParcelData.POParcelID) {
        const [poParcelCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblpoparcel WHERE POParcelID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(poParcelData.POParcelID)]
        );
        if (poParcelCheck.length === 0) errors.push(`POParcelID ${poParcelData.POParcelID} does not exist or is deleted`);
      }
    }

    if (action === 'UPDATE') {
      if (poParcelData.UOMID) {
        const [uomCheck] = await pool.query(
          'SELECT 1 FROM dbo_tbluom WHERE UOMID = ?',
          [parseInt(poParcelData.UOMID)]
        );
        if (uomCheck.length === 0) errors.push(`UOMID ${poParcelData.UOMID} does not exist`);
      }
      if (poParcelData.CertificationID) {
        const [certificationCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblcertification WHERE CertificationID = ?',
          [parseInt(poParcelData.CertificationID)]
        );
        if (certificationCheck.length === 0) errors.push(`CertificationID ${poParcelData.CertificationID} does not exist`);
      }
    }

    if (['UPDATE', 'DELETE'].includes(action) && poParcelData.CreatedByID) {
      const [createdByCheck] = await pool.query(
        'SELECT 1 FROM dbo_tblperson WHERE PersonID = ?',
        [parseInt(poParcelData.CreatedByID)]
      );
      if (createdByCheck.length === 0) errors.push(`CreatedByID ${poParcelData.CreatedByID} does not exist`);
    }

    return errors.length > 0 ? errors.join('; ') : null;
  }

  static async getPOParcelById(poParcelId) {
    try {
      if (!poParcelId) {
        return {
          success: false,
          message: 'POParcelID is required for SELECT',
          data: null,
          poParcelId: null
        };
      }

      const poParcelData = { POParcelID: poParcelId };
      const result = await this.#executeManageStoredProcedure('SELECT', poParcelData);

      return {
        success: result.success,
        message: result.message,
        data: result.data,
        poParcelId: poParcelId
      };
    } catch (error) {
      console.error('Error in getPOParcelById:', error);
      return {
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        poParcelId: poParcelId
      };
    }
  }

  static async updatePOParcel(poParcelData) {
    try {
      if (!poParcelData.POParcelID) {
        return {
          success: false,
          message: 'POParcelID is required for UPDATE',
          data: null,
          poParcelId: null
        };
      }

      const fkErrors = await this.#validateForeignKeys(poParcelData, 'UPDATE');
      if (fkErrors) {
        return {
          success: false,
          message: `Validation failed: ${fkErrors}`,
          data: null,
          poParcelId: poParcelData.POParcelID
        };
      }

      const result = await this.#executeManageStoredProcedure('UPDATE', poParcelData);
      return result;
    } catch (error) {
      console.error('Error in updatePOParcel:', error);
      return {
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        poParcelId: poParcelData.POParcelID
      };
    }
  }

  static async deletePOParcel(poParcelData) {
    try {
      if (!poParcelData.POParcelID) {
        return {
          success: false,
          message: 'POParcelID is required for DELETE',
          data: null,
          poParcelId: null
        };
      }

      const fkErrors = await this.#validateForeignKeys(poParcelData, 'DELETE');
      if (fkErrors) {
        return {
          success: false,
          message: `Validation failed: ${fkErrors}`,
          data: null,
          poParcelId: poParcelData.POParcelID
        };
      }

      const result = await this.#executeManageStoredProcedure('DELETE', poParcelData);
      return result;
    } catch (error) {
      console.error('Error in deletePOParcel:', error);
      return {
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        poParcelId: poParcelData.POParcelID
      };
    }
  }
}

module.exports = POParcelModel;