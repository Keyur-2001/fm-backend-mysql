<<<<<<< HEAD
const sql = require('mssql');
const poolPromise = require('../config/db.config');

class AddressModel {
  static async #executeStoredProcedure(action, addressData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (addressData.AddressID) request.input('AddressID', sql.Int, addressData.AddressID);
      if (addressData.AddressTitle) request.input('AddressTitle', sql.NVarChar(255), addressData.AddressTitle);
      if (addressData.AddressName) request.input('AddressName', sql.NVarChar(100), addressData.AddressName);
      if (addressData.AddressTypeID) request.input('AddressTypeID', sql.Int, addressData.AddressTypeID);
      if (addressData.AddressLine1) request.input('AddressLine1', sql.NVarChar(255), addressData.AddressLine1);
      if (addressData.AddressLine2) request.input('AddressLine2', sql.NVarChar(255), addressData.AddressLine2);
      if (addressData.City) request.input('City', sql.NVarChar(50), addressData.City);
      if (addressData.County) request.input('County', sql.NVarChar(50), addressData.County);
      if (addressData.State) request.input('State', sql.NVarChar(50), addressData.State);
      if (addressData.PostalCode) request.input('PostalCode', sql.NVarChar(50), addressData.PostalCode);
      if (addressData.Country) request.input('Country', sql.NVarChar(50), addressData.Country);
      if (addressData.PreferredBillingAddress !== undefined) request.input('PreferredBillingAddress', sql.Bit, addressData.PreferredBillingAddress);
      if (addressData.PreferredShippingAddress !== undefined) request.input('PreferredShippingAddress', sql.Bit, addressData.PreferredShippingAddress);
      if (addressData.Longitude) request.input('Longitude', sql.Decimal(9, 6), addressData.Longitude);
      if (addressData.Latitude) request.input('Latitude', sql.Decimal(9, 6), addressData.Latitude);
      if (addressData.Disabled !== undefined) request.input('Disabled', sql.Bit, addressData.Disabled);
      if (addressData.CreatedByID) request.input('CreatedByID', sql.Int, addressData.CreatedByID);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_ManageAddresses');

      return {
        success: result.output.Result === 1,
        message: result.output.Message,
        data: action === 'SELECT' ? result.recordset?.[0] || null : null,
        addressId: action === 'INSERT' ? result.recordset?.[0]?.AddressID || addressData.AddressID || null : addressData.AddressID
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async createAddress(addressData) {
    // Validate required fields
    const requiredFields = ['AddressTitle', 'AddressLine1', 'City', 'Country', 'AddressTypeID', 'CreatedByID'];
    const missingFields = requiredFields.filter(field => !addressData[field]);

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null
      };
    }

    return await this.#executeStoredProcedure('INSERT', addressData);
  }

  static async updateAddress(addressData) {
    // Validate required fields
    if (!addressData.AddressID) {
      return {
        success: false,
        message: 'AddressID is required for update',
        data: null
      };
    }

    return await this.#executeStoredProcedure('UPDATE', addressData);
  }

  static async deleteAddress(addressData) {
    // Validate required fields
    if (!addressData.AddressID) {
      return {
        success: false,
        message: 'AddressID is required for deletion',
        data: null
      };
    }

    return await this.#executeStoredProcedure('DELETE', addressData);
  }

  static async getAddress(addressData) {
    // Validate required fields
    if (!addressData.AddressID) {
      return {
        success: false,
        message: 'AddressID is required for retrieval',
        data: null
      };
    }

    return await this.#executeStoredProcedure('SELECT', addressData);
  }

  static async getAllAddresses(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('PageNumber', sql.Int, pageNumber);
      request.input('PageSize', sql.Int, pageSize);
      request.input('FromDate', sql.DateTime, fromDate ? new Date(fromDate) : null);
      request.input('ToDate', sql.DateTime, toDate ? new Date(toDate) : null);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_GetAllAddresses');

      // Calculate totalRecords (since SP doesn't return it directly)
      const totalRecords = result.recordset ? result.recordset.length : 0;

      return {
        success: result.output.Result === 1,
        message: result.output.Message,
        data: result.recordset || [],
        totalRecords,
        pageNumber,
        pageSize
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
=======
const poolPromise = require('../config/db.config');

class AddressModel {
  // Get paginated Addresses
  static async getAllAddresses({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
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
      console.log('getAllAddresses params:', queryParams);

      // Call SP_GetAllAddresses
      const [results] = await pool.query(
        'CALL fleet_monkey.SP_GetAllAddresses(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getAllAddresses results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getAllAddresses output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_GetAllAddresses');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to retrieve addresses');
      }

      // Calculate total records (since SP_GetAllAddresses doesn't provide it)
      const [countResult] = await pool.query(
        `SELECT COUNT(*) AS totalRecords 
         FROM dbo_tbladdresses a 
         WHERE a.IsDeleted = 0
           AND (? IS NULL OR a.CreatedDateTime >= ?)
           AND (? IS NULL OR a.CreatedDateTime <= ?)`,
        [fromDate, fromDate, toDate, toDate]
      );

      return {
        data: results[0] || [],
        totalRecords: countResult[0].totalRecords || 0
      };
    } catch (err) {
      console.error('getAllAddresses error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Address
  static async createAddress(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_AddressID
        data.addressTitle,
        data.addressName,
        data.addressTypeId,
        data.addressLine1,
        data.addressLine2,
        data.city,
        data.county,
        data.state,
        data.postalCode,
        data.country,
        data.preferredBillingAddress ? 1 : 0,
        data.preferredShippingAddress ? 1 : 0,
        data.longitude,
        data.latitude,
        data.disabled ? 1 : 0,
        data.createdById
      ];

      // Log query parameters
      console.log('createAddress params:', queryParams);

      // Call sp_manageaddresses
      const [results] = await pool.query(
        'CALL fleet_monkey.SP_ManageAddresses(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('createAddress results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('createAddress output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageAddresses');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create Address');
      }

      // Extract addressId from the message (since sp_manageaddresses uses LAST_INSERT_ID())
      const addressIdMatch = output[0].p_Message.match(/ID: (\d+)/);
      const addressId = addressIdMatch ? parseInt(addressIdMatch[1]) : results.insertId || null;

      return {
        addressId,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createAddress error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Address by ID
  static async getAddressById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_AddressTitle
        null, // p_AddressName
        null, // p_AddressTypeID
        null, // p_AddressLine1
        null, // p_AddressLine2
        null, // p_City
        null, // p_County
        null, // p_State
        null, // p_PostalCode
        null, // p_Country
        null, // p_PreferredBillingAddress
        null, // p_PreferredShippingAddress
        null, // p_Longitude
        null, // p_Latitude
        null, // p_Disabled
        null  // p_CreatedByID
      ];

      // Log query parameters
      console.log('getAddressById params:', queryParams);

      // Call sp_manageaddresses
      const [results] = await pool.query(
        'CALL fleet_monkey.SP_ManageAddresses(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getAddressById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getAddressById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageAddresses');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Address not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getAddressById error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update an Address
  static async updateAddress(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.addressTitle,
        data.addressName,
        data.addressTypeId,
        data.addressLine1,
        data.addressLine2,
        data.city,
        data.county,
        data.state,
        data.postalCode,
        data.country,
        data.preferredBillingAddress ? 1 : 0,
        data.preferredShippingAddress ? 1 : 0,
        data.longitude,
        data.latitude,
        data.disabled ? 1 : 0,
        data.createdById
      ];

      // Log query parameters
      console.log('updateAddress params:', queryParams);

      // Call sp_manageaddresses
      const [results] = await pool.query(
        'CALL fleet_monkey.SP_ManageAddresses(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('updateAddress results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('updateAddress output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageAddresses');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to update Address');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateAddress error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete an Address
  static async deleteAddress(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_AddressTitle
        null, // p_AddressName
        null, // p_AddressTypeID
        null, // p_AddressLine1
        null, // p_AddressLine2
        null, // p_City
        null, // p_County
        null, // p_State
        null, // p_PostalCode
        null, // p_Country
        null, // p_PreferredBillingAddress
        null, // p_PreferredShippingAddress
        null, // p_Longitude
        null, // p_Latitude
        null, // p_Disabled
        createdById
      ];

      // Log query parameters
      console.log('deleteAddress params:', queryParams);

      // Call sp_manageaddresses
      const [results] = await pool.query(
        'CALL fleet_monkey.SP_ManageAddresses(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('deleteAddress results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('deleteAddress output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageAddresses');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to delete Address');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteAddress error:', err);
      throw new Error(`Database error: ${err.message}`);
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
    }
  }
}

module.exports = AddressModel;