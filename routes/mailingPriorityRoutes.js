const express = require('express');
const MailingPriorityController = require('../controllers/mailingPriorityController');

const router = express.Router();
// const MailingPriorityController = require('../controllers/MailingPriorityController');

// // GET all mailing priorities
router.get('/', MailingPriorityController.getAllMailingPriorities);

// // UPDATE mailing priority by ID
router.put('/:id', MailingPriorityController.updateMailingPriority);

module.exports = router;