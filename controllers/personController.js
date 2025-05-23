const PersonModel = require('../models/personModel');

class PersonController {
  // Get all persons with pagination
  static async getAllPersons(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;

      const persons = await PersonModel.getAllPersons({
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize),
        fromDate,
        toDate
      });

      return res.status(200).json({
        success: true,
        message: 'Persons retrieved successfully',
        data: persons.data,
        totalRecords: persons.totalRecords
      });
    } catch (err) {
      console.error('getAllPersons error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        personId: null
      });
    }
  }

  // Create a new person
  static async createPerson(req, res) {
    try {
      const {
        firstName,
        middleName,
        lastName,
        roleId,
        status,
        salutation,
        designation,
        gender,
        dob,
        joiningDate,
        companyId,
        isExternal,
        loginId,
        password,
        emailId,
        isDarkMode,
        createdById
      } = req.body;

      // Basic validation
      if (!firstName || !lastName || !roleId || !status || !loginId || !emailId || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'FirstName, LastName, RoleID, Status, LoginID, EmailID, and CreatedByID are required',
          data: null,
          personId: null
        });
      }

      const result = await PersonModel.createPerson({
        firstName,
        middleName,
        lastName,
        roleId,
        status,
        salutation,
        designation,
        gender,
        dob,
        joiningDate,
        companyId,
        isExternal,
        loginId,
        password,
        emailId,
        isDarkMode,
        createdById
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        personId: result.personId
      });
    } catch (err) {
      console.error('createPerson error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        personId: null
      });
    }
  }

  // Get a single person by ID
  static async getPersonById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid PersonID is required',
          data: null,
          personId: null
        });
      }

      const person = await PersonModel.getPersonById(parseInt(id));

      if (!person) {
        return res.status(404).json({
          success: false,
          message: 'Person not found',
          data: null,
          personId: id
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Person retrieved successfully',
        data: person,
        personId: id
      });
    } catch (err) {
      console.error('getPersonById error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        personId: null
      });
    }
  }

  // Update a person
  static async updatePerson(req, res) {
    try {
      const { id } = req.params;
      const {
        firstName,
        middleName,
        lastName,
        roleId,
        status,
        salutation,
        designation,
        gender,
        dob,
        joiningDate,
        companyId,
        isExternal,
        loginId,
        password,
        emailId,
        isDarkMode,
        createdById
      } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid PersonID is required',
          data: null,
          personId: null
        });
      }

      if (!firstName || !lastName || !roleId || !status || !loginId || !emailId || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'FirstName, LastName, RoleID, Status, LoginID, EmailID, and CreatedByID are required',
          data: null,
          personId: id
        });
      }

      const result = await PersonModel.updatePerson(parseInt(id), {
        firstName,
        middleName,
        lastName,
        roleId,
        status,
        salutation,
        designation,
        gender,
        dob,
        joiningDate,
        companyId,
        isExternal,
        loginId,
        password,
        emailId,
        isDarkMode,
        createdById
      });

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        personId: id
      });
    } catch (err) {
      console.error('updatePerson error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        personId: null
      });
    }
  }

  // Delete a person
  static async deletePerson(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid PersonID is required',
          data: null,
          personId: null
        });
      }

      if (!createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedByID is required',
          data: null,
          personId: id
        });
      }

      const result = await PersonModel.deletePerson(parseInt(id), createdById);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        personId: id
      });
    } catch (err) {
      console.error('deletePerson error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        personId: null
      });
    }
  }
}

module.exports = PersonController;