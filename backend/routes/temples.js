const express = require('express');
const router = express.Router();
const { getTemples, getTemple, createTemple, updateTemple, deleteTemple } = require('../controllers/templeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getTemples);
router.get('/:id', getTemple);
router.post('/', protect, authorize('admin', 'organizer'), createTemple);
router.put('/:id', protect, authorize('admin', 'organizer'), updateTemple);
router.delete('/:id', protect, authorize('admin'), deleteTemple);

module.exports = router;
