const jwt = require('jsonwebtoken');
const User = require('../models/authModel');
require('dotenv').config();

// const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';
const SECRET_KEY = 'your-default-secret-key';

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Authorization header missing or invalid',
      solution: 'Include Authorization header with format: Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      message: 'Token missing from Authorization header',
      solution: 'Ensure token follows Bearer scheme: Bearer <token>'
    });
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await User.isTokenBlacklisted(token);
    console.log('Checking if token is blacklisted:', token);
    console.log('Is token blacklisted?', isBlacklisted);
    if (isBlacklisted) {
      return res.status(401).json({ 
        message: 'Token has been invalidated (logged out)',
        solution: 'Please log in again to obtain a new token'
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Fetch the role name using the RoleID from the token
    const role = await User.getRoleById(decoded.role);
    if (!role) {
      return res.status(401).json({
        message: 'Role not found for the user',
        solution: 'Ensure the user’s role exists in the database'
      });
    }

    req.user = { 
      personId: decoded.personId, 
      roleId: decoded.role, // This is the RoleID
      role: role.RoleName // This is the role name (e.g., 'Administrator')
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ 
      message: 'Invalid or expired token',
      error: err.message 
    });
  }
};