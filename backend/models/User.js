const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'], trim: true },
  email: { type: String, required: [true, 'Please add an email'], unique: true, lowercase: true },
  phone: { type: String, required: [true, 'Please add a phone number'] },
  address: { type: String },
  password: { type: String, required: [true, 'Please add a password'], minlength: 6, select: false },
  role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Encrypt password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', UserSchema);
