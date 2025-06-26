const poolPromise = require('../config/db.config');

class CertificationModel {
  // Get paginated Certifications
  static async getAllCertifications({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
  try {
    const pool = await poolPromise;

    // Validate parameters
    if (pageNumber < 1) pageNumber = 1;
    if (pageSize < 1 || pageSize > 100) pageSize = 10; // Cap pageSize at 100
    let formattedFromDate = null, formattedToDate = null;

    if (fromDate) {
      formattedFromDate = new Date(fromDate);
      if (isNaN(formattedFromDate)) throw new Error('Invalid fromDate');
    }
    if (toDate) {
      formattedToDate = new Date(toDate);
      if (isNaN(formattedToDate)) throw new Error('Invalid toDate');
    }
    if (formattedFromDate && formattedToDate && formattedFromDate > formattedToDate) {
      throw new Error('fromDate cannot be later than toDate');
    }

    const queryParams = [
      pageNumber,
      pageSize,
      formattedFromDate ? formattedFromDate.toISOString().split('T')[0] : null, // Format as YYYY-MM-DD
      formattedToDate ? formattedToDate.toISOString().split('T')[0] : null
    ];

    // Log query parameters
    console.log('getAllCertifications params:', queryParams);

    // Call SP_GetAllCertification
    const [results] = await pool.query(
      'CALL SP_GetAllCertification(?, ?, ?, ?, @p_Result, @p_Message)',
      queryParams
    );

    // Log results
    console.log('getAllCertifications results:', JSON.stringify(results, null, 2));

    // Retrieve OUT parameters
    const [[outParams]] = await pool.query('SELECT @p_Result AS StatusCode, @p_Message AS Message');

    // Log output
    console.log('getAllCertifications output:', JSON.stringify(outParams, null, 2));

    if (!outParams || typeof outParams.StatusCode === 'undefined') {
      throw new Error('Output parameters missing from SP_GetAllCertification');
    }

    if (outParams.StatusCode !== 1) {
      throw new Error(outParams.Message || 'Failed to retrieve Certifications');
    }

    // Extract total count from the second result set
    const totalRecords = results[1]?.[0]?.TotalRecords || 0;

    return {
      data: results[0] || [],
      totalRecords,
      currentPage: pageNumber,
      pageSize,
      totalPages: Math.ceil(totalRecords / pageSize)
    };
  } catch (err) {
    console.error('getAllCertifications error:', err);
    throw new Error(`Database error: ${err.message}`);
  }
}

  // Create a new Certification
  static async createCertification(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_CertificationID
        data.certificationName,
        data.createdById
      ];

      // Log query parameters
      console.log('createCertification params:', queryParams);

      // Call sp_ManageCertification
      const [results] = await pool.query(
        'CALL sp_ManageCertification(?, ?, ?, ?)',
        queryParams
      );

      // Log results
      console.log('createCertification results:', JSON.stringify(results, null, 2));

      // Handle result sets
      let statusResult;
      if (!results || results.length === 0) {
        throw new Error('No result returned from sp_ManageCertification');
      } else if (results.length === 1) {
        if (results[0].length === 0) {
          throw new Error('Empty result set from sp_ManageCertification');
        }
        if (!results[0][0]) {
          throw new Error(`First row of result set is undefined: ${JSON.stringify(results[0])}`);
        }
        statusResult = results[0][0];
      } else if (results.length > 1) {
        if (results[1].length === 0) {
          throw new Error('Empty status result set from sp_ManageCertification');
        }
        if (!results[1][0]) {
          throw new Error(`First row of status result set is undefined: ${JSON.stringify(results[1])}`);
        }
        statusResult = results[1][0];
      } else {
        throw new Error(`Unexpected result format from sp_ManageCertification: ${JSON.stringify(results)}`);
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageCertification result: ${JSON.stringify(statusResult)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to create Certification');
      }

      return {
        certificationId: null, // SP does not return new ID
        message: statusResult.Message
      };
    } catch (err) {
      console.error('createCertification error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Certification by ID
  static async getCertificationById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = ['SELECT', id, null, null];

      // Log query parameters
      console.log('getCertificationById params:', queryParams);

      // Call sp_ManageCertification
      const [results] = await pool.query(
        'CALL sp_ManageCertification(?, ?, ?, ?)',
        queryParams
      );

      // Log results
      console.log('getCertificationById results:', JSON.stringify(results, null, 2));

    // Handle result sets
    if (!results || results.length === 0) {
      throw new Error('No result returned from SP_ManageCertification');
    }
  }

  // Update a Certification
  static async updateCertification(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.certificationName || null,
        data.createdById
      ];

      // Log query parameters
      console.log('updateCertification params:', queryParams);

      // Call sp_ManageCertification
      const [results] = await pool.query(
        'CALL sp_ManageCertification(?, ?, ?, ?)',
        queryParams
      );

      // Log results
      console.log('updateCertification results:', JSON.stringify(results, null, 2));

      // Handle result sets
      let statusResult;
      if (!results || results.length === 0) {
        throw new Error('No result returned from sp_ManageCertification');
      } else if (results.length === 1) {
        if (results[0].length === 0) {
          throw new Error('Empty result set from sp_ManageCertification');
        }
        if (!results[0][0]) {
          throw new Error(`First row of result set is undefined: ${JSON.stringify(results[0])}`);
        }
        statusResult = results[0][0];
      } else if (results.length > 1) {
        if (results[1].length === 0) {
          throw new Error('Empty status result set from sp_ManageCertification');
        }
        if (!results[1][0]) {
          throw new Error(`First row of status result set is undefined: ${JSON.stringify(results[1])}`);
        }
        statusResult = results[1][0];
      } else {
        throw new Error(`Unexpected result format from sp_ManageCertification: ${JSON.stringify(results)}`);
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageCertification result: ${JSON.stringify(statusResult)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to update Certification');
      }


    if (statusResult.StatusCode !== 1) {
      throw new Error(statusResult.Message || 'Failed to create Certification');
    }

    // Extract certification ID from the message if provided
    const certificationIdMatch = statusResult.Message.match(/ID: (\d+)/);
    const certificationId = certificationIdMatch ? certificationIdMatch[1] : null;

    return {
      certificationId: certificationId, // Extracted from message
      message: statusResult.Message
    };
    } catch (err) {
      console.error('updateCertification error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Certification
  static async deleteCertification(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_CertificationName
        createdById
      ];

      // Log query parameters
      console.log('deleteCertification params:', queryParams);

      // Call sp_ManageCertification
      const [results] = await pool.query(
        'CALL sp_ManageCertification(?, ?, ?, ?)',
        queryParams
      );

      // Log results
      console.log('deleteCertification results:', JSON.stringify(results, null, 2));

      // Handle result sets
      let statusResult;
      if (!results || results.length === 0) {
        throw new Error('No result returned from sp_ManageCertification');
      } else if (results.length === 1) {
        if (results[0].length === 0) {
          throw new Error('Empty result set from sp_ManageCertification');
        }
        if (!results[0][0]) {
          throw new Error(`First row of result set is undefined: ${JSON.stringify(results[0])}`);
        }
        statusResult = results[0][0];
      } else if (results.length > 1) {
        if (results[1].length === 0) {
          throw new Error('Empty status result set from sp_ManageCertification');
        }
        if (!results[1][0]) {
          throw new Error(`First row of status result set is undefined: ${JSON.stringify(results[1])}`);
        }
        statusResult = results[1][0];
      } else {
        throw new Error(`Unexpected result format from sp_ManageCertification: ${JSON.stringify(results)}`);
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageCertification result: ${JSON.stringify(statusResult)}`);
      }

    if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
      throw new Error(`StatusCode missing in SP_ManageCertification result: ${JSON.stringify(statusResult)}`);
    }
    if (statusResult.StatusCode !== 1) {
      throw new Error(statusResult.Message || 'Failed to create Certification');
    }

    // Extract certification ID from the message if provided
    const certificationIdMatch = statusResult.Message.match(/ID: (\d+)/);
    const certificationId = certificationIdMatch ? certificationIdMatch[1] : null;

    return {
      message: statusResult.Message
    };
    } catch (err) {
      console.error('deleteCertification error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = CertificationModel;