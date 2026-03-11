const mongoose = require('mongoose');

const DarshanSlotSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  date: { type: String, required: [true, 'Date is required'] },
  startTime: { type: String, required: [true, 'Start time is required'] },
  endTime: { type: String, required: [true, 'End time is required'] },
  totalSeats: { type: Number, required: true, min: 1 },
  availableSeats: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  poojaType: { type: String, default: 'General Darshan' },
  isSpecial: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DarshanSlot', DarshanSlotSchema);
