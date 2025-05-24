const mysql = require('mysql2/promise');
const poolPromise = require('../config/db.config');
const bcrypt = require('bcrypt');

class User {
  // Create a new user in dbo_tblperson with all required fields
  static async createUser(userData, CreatedByID) {
    const pool = await poolPromise;
    const query = `
      INSERT INTO dbo_tblperson (
        FirstName, MiddleName, LastName, EmailID, LoginID, Password, RoleID, CompanyID,
        CreatedByID, CreatedDateTime, IsDeleted
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0
      );
      SELECT LAST_INSERT_ID() AS PersonID;
    `;

    // Input validation and sanitization
    const values = [
      userData.FirstName?.trim(),
      userData.MiddleName?.trim() || null,
      userData.LastName?.trim(),
      userData.EmailID?.trim(),
      userData.LoginID?.trim(),
      userData.Password,
      parseInt(userData.RoleID),
      parseInt(userData.CompanyID),
      parseInt(CreatedByID)
    ];

    const [results] = await pool.query(query, values);
    // MySQL returns the inserted ID in the second result set
    const insertedId = results[1][0].PersonID;
    return insertedId;
  }

  // Check if a role exists
  static async getRoleById(RoleID) {
    const pool = await poolPromise;
    const query = `
      SELECT RoleID, RoleName 
      FROM dbo_tblroles 
      WHERE RoleID = ? AND IsDeleted = 0;
    `;
    const [rows] = await pool.query(query, [parseInt(RoleID)]);
    return rows[0];
  }

  // Check if a company exists
  static async getCompanyById(CompanyID) {
    const pool = await poolPromise;
    const query = `
      SELECT CompanyID, CompanyName 
      FROM dbo_tblcompany 
      WHERE CompanyID = ? AND IsDeleted = 0;
    `;
    const [rows] = await pool.query(query, [parseInt(CompanyID)]);
    return rows[0];
  }

  // Check for duplicate LoginID or EmailID
  static async checkExistingUser(LoginID, EmailID) {
    const pool = await poolPromise;
    const query = `
      SELECT PersonID 
      FROM dbo_tblperson 
      WHERE (LoginID = ? OR EmailID = ?) AND IsDeleted = 0;
    `;
    const [rows] = await pool.query(query, [LoginID?.trim(), EmailID?.trim()]);
    return rows.length > 0;
  }

  // Get list of admins
  static async getAdmins() {
    const pool = await poolPromise;
    const query = `
      SELECT p.PersonID, p.LoginID, p.EmailID 
      FROM dbo_tblperson p 
      INNER JOIN dbo_tblroles r ON p.RoleID = r.RoleID 
      WHERE r.RoleName IN ('Administrator', 'Admin') AND p.IsDeleted = 0;
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // Get user by LoginID for authentication
  static async getUserByLoginID(LoginID) {
    const pool = await poolPromise;
    const query = `
      SELECT p.PersonID, p.LoginID, p.Password, p.RoleID, r.RoleName
      FROM dbo_tblperson p 
      JOIN dbo_tblroles r ON p.RoleID = r.RoleID
      WHERE p.LoginID = ? AND p.IsDeleted = 0;
    `;
    const [rows] = await pool.query(query, [LoginID?.trim()]);
    return rows[0];
  }
}

module.exports = User;