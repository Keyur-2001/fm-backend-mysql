const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/personController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

<<<<<<< HEAD
router.get('/', PersonController.getAllPersons);
router.post('/',authMiddleware, PersonController.createPerson);
router.get('/:id', PersonController.getPersonById);
router.put('/:id', authMiddleware, PersonController.updatePerson);
router.delete('/:id', authMiddleware, PersonController.deletePerson);
router.post('/:id/upload-image', authMiddleware, upload.single('image'), PersonController.uploadProfileImage);
=======
// Routes for Person management
router.get('/', PersonController.getAllPersons); // GET /api/persons
router.post('/', PersonController.createPerson); // POST /api/persons
router.get('/:id', PersonController.getPersonById); // GET /api/persons/:id
router.put('/:id', PersonController.updatePerson); // PUT /api/persons/:id
router.delete('/:id', PersonController.deletePerson); // DELETE /api/persons/:id
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7

module.exports = router;