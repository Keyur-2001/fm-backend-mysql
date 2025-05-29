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
        fromDate ? new Date(fromDate).toISOString().split('T')[0] : null,
        toDate ? new Date(toDate).toISOString().split('T')[0] : null
      ];

      console.log('getAllCertifications params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageCertification(?, ?, ?, ?)',
        queryParams
      );

      console.log('getAllCertifications results:', JSON.stringify(results, null, 2));

      return {
        data: results[0] || [],
        totalRecords: null
      };
    } catch (err) {
      console.error('getAllCertifications error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Certification
  static async createCertification(data) {
    try {
      const pool = await poolPromise;

      // Validate input
      if (!data.certificationName || !data.createdById) {
        throw new Error('CertificationName and CreatedByID are required');
      }

      const queryParams = [
        'INSERT',
        null,
        data.certificationName,
        parseInt(data.createdById)
      ];

      console.log('createCertification params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageCertification(?, ?, ?, ?)',
        queryParams
      );

      console.log('createCertification results:', JSON.stringify(results, null, 2));

      // Find status result set
      let statusResult = null;
      for (const resultSet of results) {
        if (Array.isArray(resultSet) && resultSet[0] && 'StatusCode' in resultSet[0]) {
          statusResult = resultSet[0];
          break;
        }
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageCertification result: ${JSON.stringify(results)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to create Certification');
      }

      // Extract CertificationID from Message (e.g., "Certification created successfully. ID: 1")
      const idMatch = statusResult.Message.match(/ID: (\d+)/);
      const certificationId = idMatch ? parseInt(idMatch[1]) : null;

      return {
        certificationId,
        message: statusResult.Message
      };
    } catch (err) {
      console.error('createCertification error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Certification by ID
  static async getCertificationById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = ['SELECT', parseInt(id), null, null];

      console.log('getCertificationById params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageCertification(?, ?, ?, ?)',
        queryParams
      );

      console.log('getCertificationById results:', JSON.stringify(results, null, 2));

      // Find data and status result sets
      let dataResult = null;
      let statusResult = null;
      for (const resultSet of results) {
        if (Array.isArray(resultSet)) {
          if (resultSet[0] && 'CertificationID' in resultSet[0]) {
            dataResult = resultSet[0];
          } else if (resultSet[0] && 'StatusCode' in resultSet[0]) {
            statusResult = resultSet[0];
          }
        }
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageCertification result: ${JSON.stringify(results)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Certification not found');
      }

      return dataResult || null;
    } catch (err) {
      console.error('getCertificationById error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Certification
  static async updateCertification(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        parseInt(id),
        data.certificationName || null,
        parseInt(data.createdById)
      ];

      console.log('updateCertification params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageCertification(?, ?, ?, ?)',
        queryParams
      );

      console.log('updateCertification results:', JSON.stringify(results, null, 2));

      let statusResult = null;
      for (const resultSet of results) {
        if (Array.isArray(resultSet) && resultSet[0] && 'StatusCode' in resultSet[0]) {
          statusResult = resultSet[0];
          break;
        }
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageCertification result: ${JSON.stringify(results)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to update Certification');
      }

      return {
        message: statusResult.Message
      };
    } catch (err) {
      console.error('updateCertification error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Certification
  static async deleteCertification(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        parseInt(id),
        null,
        parseInt(createdById)
      ];

      console.log('deleteCertification params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageCertification(?, ?, ?, ?)',
        queryParams
      );

      console.log('deleteCertification results:', JSON.stringify(results, null, 2));

      let statusResult = null;
      for (const resultSet of results) {
        if (Array.isArray(resultSet) && resultSet[0] && 'StatusCode' in resultSet[0]) {
          statusResult = resultSet[0];
          break;
        }
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageCertification result: ${JSON.stringify(results)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to delete Certification');
      }

      return {
        message: statusResult.Message
      };
    } catch (err) {
      console.error('deleteCertification error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = CertificationModel;