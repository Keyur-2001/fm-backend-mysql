const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/personController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', PersonController.getAllPersons);
router.post('/',authMiddleware, PersonController.createPerson);
router.get('/:id', PersonController.getPersonById);
router.put('/:id', authMiddleware, PersonController.updatePerson);
router.delete('/:id', authMiddleware, PersonController.deletePerson);
router.post('/:id/upload-image', authMiddleware, upload.single('image'), PersonController.uploadProfileImage);

module.exports = router;