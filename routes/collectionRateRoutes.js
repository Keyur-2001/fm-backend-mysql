const express = require('express');
const router = express.Router();
const CollectionRateController = require('../controllers/collectionRateController');

router.get('/', CollectionRateController.getAllCollectionRates);
router.post('/', CollectionRateController.createCollectionRate);
router.get('/:id', CollectionRateController.getCollectionRateById);
router.put('/:id', CollectionRateController.updateCollectionRate);
router.delete('/:id', CollectionRateController.deleteCollectionRate);

module.exports = router;