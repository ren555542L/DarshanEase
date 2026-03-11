const User = require('../models/User');
const Temple = require('../models/Temple');
const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');

// @desc    Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all organizers
const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: 'organizer' }).sort({ createdAt: -1 });
    res.json({ success: true, count: organizers.length, data: organizers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get analytics
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user', isActive: true });
    const totalOrganizers = await User.countDocuments({ role: 'organizer', isActive: true });
    const totalTemples = await Temple.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const totalSlots = await DarshanSlot.countDocuments({ isActive: true });

    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      data: { totalUsers, totalOrganizers, totalTemples, totalBookings, confirmedBookings, cancelledBookings, totalSlots, totalRevenue }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create organizer
const createOrganizer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });
    const organizer = await User.create({ name, email, phone, password, role: 'organizer' });
    res.status(201).json({ success: true, data: organizer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, getAllOrganizers, updateUser, deleteUser, getAnalytics, createOrganizer };
