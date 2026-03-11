const Temple = require('../models/Temple');

// @desc    Get all temples
// @route   GET /api/temples
const getTemples = async (req, res) => {
  try {
    const temples = await Temple.find({ isActive: true }).populate('organizerId', 'name email');
    res.json({ success: true, count: temples.length, data: temples });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single temple
// @route   GET /api/temples/:id
const getTemple = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id).populate('organizerId', 'name email');
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, data: temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create temple (admin/organizer)
// @route   POST /api/temples
const createTemple = async (req, res) => {
  try {
    req.body.organizerId = req.user.id;
    const temple = await Temple.create(req.body);
    res.status(201).json({ success: true, data: temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update temple
// @route   PUT /api/temples/:id
const updateTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, data: temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete temple
// @route   DELETE /api/temples/:id
const deleteTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, message: 'Temple deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTemples, getTemple, createTemple, updateTemple, deleteTemple };
