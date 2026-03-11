const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');

// @desc    Create booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { slotId, templeId, numDevotees, donationAmount, specialRequests } = req.body;

    const slot = await DarshanSlot.findById(slotId);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    if (slot.availableSeats < numDevotees) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    const totalAmount = (slot.price * numDevotees) + (donationAmount || 0);
    const booking = await Booking.create({
      userId: req.user.id,
      slotId,
      templeId,
      numDevotees,
      totalAmount,
      donationAmount: donationAmount || 0,
      specialRequests: specialRequests || ''
    });

    // Decrement available seats
    slot.availableSeats -= numDevotees;
    await slot.save();

    await booking.populate([
      { path: 'slotId' },
      { path: 'templeId', select: 'templeName location' }
    ]);

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('slotId')
      .populate('templeId', 'templeName location image')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Booking already cancelled' });

    booking.status = 'cancelled';
    await booking.save();

    // Restore seats
    const slot = await DarshanSlot.findById(booking.slotId);
    if (slot) {
      slot.availableSeats += booking.numDevotees;
      await slot.save();
    }

    res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('slotId')
      .populate('templeId', 'templeName')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get booking by ticket ID
// @route   GET /api/bookings/ticket/:ticketId
const getBookingByTicket = async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketId: req.params.ticketId })
      .populate('userId', 'name email phone')
      .populate('slotId')
      .populate('templeId', 'templeName location');
    if (!booking) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings, getBookingByTicket };
