const jwt = require('jsonwebtoken');
const User = require('../models/authModel');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

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
    req.user = { 
      personId: decoded.personId, 
      role: decoded.role 
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ 
      message: 'Invalid or expired token',
      error: err.message 
    });
  }
};