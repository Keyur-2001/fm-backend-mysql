const poolPromise = require('../config/db.config');

class CertificationModel {
  // Get paginated Certifications
  static async getAllCertifications({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      // Log query parameters
      console.log('getAllCertifications params:', queryParams);

      // Call SP_GetAllCertification
      const [results] = await pool.query(
        'CALL SP_GetAllCertification(?, ?, ?, ?)',
        queryParams
      );

      // Log results
      console.log('getAllCertifications results:', JSON.stringify(results, null, 2));

      // Handle result sets
      if (!results || results.length < 2) {
        throw new Error('Unexpected result format from SP_GetAllCertification');
      }

      const certificationData = results[0] || [];
      const totalRecordsResult = results[1] || [{ TotalRecords: 0 }];

      return {
        success: true,
        message: 'Certifications retrieved successfully',
        data: certificationData,
        totalRecords: totalRecordsResult[0].TotalRecords || 0
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

    // Call sp_ManageCertification
    const [results] = await pool.query(
      'CALL SP_ManageCertification(?, ?, ?, ?)',
      queryParams
    );

    // Log results with detailed structure
    console.log('createCertification results length:', results.length);
    console.log('createCertification results:', JSON.stringify(results, null, 2));

    // Handle result sets
    let statusResult;
    if (!results || results.length === 0) {
      throw new Error('No result returned from SP_ManageCertification');
    }

    // Status is in the first result set (results[0])
    if (results[0].length === 0) {
      throw new Error('Empty result set from SP_ManageCertification');
    }
    statusResult = results[0][0];

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
      certificationId: certificationId, // Extracted from message
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

    // Check the data result set (typically results[0])
    if (results[0].length === 0) {
      throw new Error('No certification found for the given ID');
    }

    let certificationData = results[0][0]; // Assume data is in the first result set

    // Check for status result if available (e.g., results[1])
    let statusResult = results.length > 1 && results[1].length > 0 ? results[1][0] : null;
    if (statusResult && typeof statusResult.StatusCode !== 'undefined') {
      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to retrieve certification');
      }
    } else if (statusResult === null) {
      console.warn('No status result returned, assuming success based on data presence');
    }

    return certificationData; // Return the certification data
  } catch (err) {
    console.error('getCertificationById error:', err);
    throw new Error(`Database error: ${err.message}`);
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
       // Handle result sets
    let statusResult;
    if (!results || results.length === 0) {
      throw new Error('No result returned from SP_ManageCertification');
    }

    // Status is in the first result set (results[0])
    if (results[0].length === 0) {
      throw new Error('Empty result set from SP_ManageCertification');
    }
    statusResult = results[0][0];

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
     // Handle result sets
    let statusResult;
    if (!results || results.length === 0) {
      throw new Error('No result returned from SP_ManageCertification');
    }

    // Status is in the first result set (results[0])
    if (results[0].length === 0) {
      throw new Error('Empty result set from SP_ManageCertification');
    }
    statusResult = results[0][0];

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