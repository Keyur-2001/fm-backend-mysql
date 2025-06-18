// controllers/mailingPriorityController.js
const MailingPriorityModel = require('../models/mailingPriorityModel');
// No need for sql or dbConfig since the model handles the connection

class MailingPriorityController {
  // GET all mailing priorities
  static async getAllMailingPriorities(req, res) {
    try {
      const mailingPriorities = await MailingPriorityModel.getAllMailingPriorities();
      res.status(200).json({
        success: true,
        data: mailingPriorities,
        count: mailingPriorities.length
      });
    } catch (err) {
      console.error('Error in getAllMailingPriorities:', err);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }

  // UPDATE mailing priority by ID
  static async updateMailingPriority(req, res) {
    try {
      const { id } = req.params; // Extract MailingPriorityID from URL
      const data = req.body;     // Extract update data from request body

      // Validate the ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid MailingPriorityID'
        });
      }

      // Validate input data
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Update data is required'
        });
      }

      const updatedPriority = await MailingPriorityModel.updateMailingPriority(id, data);

      if (!updatedPriority) {
        return res.status(404).json({
          success: false,
          message: `Mailing Priority with ID ${id} not found or already deleted`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Mailing Priority updated successfully',
        data: updatedPriority
      });
    } catch (err) {
      console.error(`Error in updateMailingPriority for ID ${req.params.id}:`, err);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }
}

module.exports = MailingPriorityController;