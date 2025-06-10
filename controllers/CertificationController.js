const CertificationModel = require('../models/certificationModel');

class CertificationController {
  // Get all Certifications
  static async getAllCertifications(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;
      console.log('getAllCertifications query:', { pageNumber, pageSize, fromDate, toDate });

      const result = await CertificationModel.getAllCertifications({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        fromDate,
        toDate
      });

      res.status(200).json({
        success: true,
        message: 'Certifications retrieved successfully.',
        data: result.data,
        certificationId: null,
        newCertificationId: null
      });
    } catch (err) {
      console.error('Error in getAllCertifications:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        certificationId: null,
        newCertificationId: null
      });
    }
  }

  // Create a new Certification
  static async createCertification(req, res) {
    try {
      const data = req.body;
      // Validate required fields
      if (!data.certificationName || !data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'CertificationName and CreatedByID are required.',
          data: null,
          certificationId: null,
          newCertificationId: null
        });
      }

      const result = await CertificationModel.createCertification(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        certificationId: null,
        newCertificationId: result.certificationId
      });
    } catch (err) {
      console.error('Error in createCertification:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        certificationId: null,
        newCertificationId: null
      });
    }
  }

  // Get a single Certification by ID
  static async getCertificationById(req, res) {
    try {
      const { id } = req.params;
      const certification = await CertificationModel.getCertificationById(parseInt(id));
      if (!certification) {
        return res.status(404).json({
          success: false,
          message: 'Certification not found.',
          data: null,
          certificationId: null,
          newCertificationId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Certification retrieved successfully.',
        data: certification,
        certificationId: id,
        newCertificationId: null
      });
    } catch (err) {
      console.error('Error in getCertificationById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        certificationId: null,
        newCertificationId: null
      });
    }
  }

  // Update a Certification
  static async updateCertification(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedByID is required.',
          data: null,
          certificationId: null,
          newCertificationId: null
        });
      }

      const result = await CertificationModel.updateCertification(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        certificationId: id,
        newCertificationId: null
      });
    } catch (err) {
      console.error('Error in updateCertification:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        certificationId: null,
        newCertificationId: null
      });
    }
  }

  // Delete a Certification
  static async deleteCertification(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;
      if (!createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedByID is required.',
          data: null,
          certificationId: null,
          newCertificationId: null
        });
      }

      const result = await CertificationModel.deleteCertification(parseInt(id), createdById);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        certificationId: id,
        newCertificationId: null
      });
    } catch (err) {
      console.error('Error in deleteCertification:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        certificationId: null,
        newCertificationId: null
      });
    }
  }
}

module.exports = CertificationController;