const DarshanSlot = require('../models/DarshanSlot');

// @desc    Get slots for a temple
// @route   GET /api/slots/temple/:templeId
const getSlotsByTemple = async (req, res) => {
  try {
    const slots = await DarshanSlot.find({ templeId: req.params.templeId, isActive: true }).sort({ date: 1, startTime: 1 });
    res.json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all slots (admin/organizer)
// @route   GET /api/slots
const getAllSlots = async (req, res) => {
  try {
    const slots = await DarshanSlot.find({ isActive: true }).populate('templeId', 'templeName location');
    res.json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create slot
// @route   POST /api/slots
const createSlot = async (req, res) => {
  try {
    const slotData = { ...req.body, availableSeats: req.body.totalSeats };
    const slot = await DarshanSlot.create(slotData);
    res.status(201).json({ success: true, data: slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update slot
// @route   PUT /api/slots/:id
const updateSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, data: slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete slot
// @route   DELETE /api/slots/:id
const deleteSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, message: 'Slot deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSlotsByTemple, getAllSlots, createSlot, updateSlot, deleteSlot };
