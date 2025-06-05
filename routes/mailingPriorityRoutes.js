const express = require('express');
const router = express.Router();
const MailingPriorityController = require('../controllers/MailingPriorityController');

// Routes for Mailing Priority management
router.get('/', MailingPriorityController.getAllMailingPriorities); // GET /api/mailing-priorities
router.post('/', MailingPriorityController.createMailingPriority); // POST /api/mailing-priorities
router.get('/:id', MailingPriorityController.getMailingPriorityById); // GET /api/mailing-priorities/:id
router.put('/:id', MailingPriorityController.updateMailingPriority); // PUT /api/mailing-priorities/:id
router.delete('/:id', MailingPriorityController.deleteMailingPriority); // DELETE /api/mailing-priorities/:id

module.exports = router;