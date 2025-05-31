const express = require('express');
const router = express.Router();
const CollectionRateController = require('../controllers/collectionRateController');

<<<<<<< HEAD
router.get('/', CollectionRateController.getAllCollectionRates);
router.post('/', CollectionRateController.createCollectionRate);
router.get('/:id', CollectionRateController.getCollectionRateById);
router.put('/:id', CollectionRateController.updateCollectionRate);
router.delete('/:id', CollectionRateController.deleteCollectionRate);
=======
// Routes for Collection Rate management
router.get('/', CollectionRateController.getAllCollectionRates); // GET /api/collection-rates
router.get('/all', CollectionRateController.getAllCollectionRatesNoPagination); // GET /api/collection-rates/all
router.post('/', CollectionRateController.createCollectionRate); // POST /api/collection-rates
router.get('/:id', CollectionRateController.getCollectionRateById); // GET /api/collection-rates/:id
router.put('/:id', CollectionRateController.updateCollectionRate); // PUT /api/collection-rates/:id
router.delete('/:id', CollectionRateController.deleteCollectionRate); // DELETE /api/collection-rates/:id
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7

module.exports = router;