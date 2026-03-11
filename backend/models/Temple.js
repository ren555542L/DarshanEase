const mongoose = require('mongoose');

const TempleSchema = new mongoose.Schema({
  templeName: { type: String, required: [true, 'Temple name is required'], trim: true },
  location: { type: String, required: [true, 'Location is required'] },
  description: { type: String, default: '' },
  deity: { type: String, default: '' },
  image: { type: String, default: '' },
  darshanStartTime: { type: String, required: true },
  darshanEndTime: { type: String, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amenities: [{ type: String }],
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Temple', TempleSchema);
