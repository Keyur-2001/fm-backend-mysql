const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/personController');

router.get('/', PersonController.getAllPersons);
router.post('/', PersonController.createPerson);
router.get('/:id', PersonController.getPersonById);
router.put('/:id', PersonController.updatePerson);
router.delete('/:id', PersonController.deletePerson);

module.exports = router;