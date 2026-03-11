const express = require('express');
const router = express.Router();
const { getSlotsByTemple, getAllSlots, createSlot, updateSlot, deleteSlot } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'organizer'), getAllSlots);
router.get('/temple/:templeId', getSlotsByTemple);
router.post('/', protect, authorize('admin', 'organizer'), createSlot);
router.put('/:id', protect, authorize('admin', 'organizer'), updateSlot);
router.delete('/:id', protect, authorize('admin', 'organizer'), deleteSlot);

module.exports = router;
