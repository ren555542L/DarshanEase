const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'DarshanSlot', required: true },
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  bookingDate: { type: Date, default: Date.now },
  numDevotees: { type: Number, required: true, min: 1, max: 10 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  ticketId: { type: String, unique: true },
  donationAmount: { type: Number, default: 0 },
  specialRequests: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate ticket ID before save
BookingSchema.pre('save', function (next) {
  if (!this.ticketId) {
    const prefix = 'DE';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.ticketId = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
