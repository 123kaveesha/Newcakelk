const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const cakemakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  specialty: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  },
  photo: {
    type: String,
    default: '/images/default-cakemaker.jpg'
  },
  products: [{
    name: String,
    price: Number,
    description: String,
    photo: {
      type: String,
      default: '/images/default-product.jpg'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
cakemakerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
cakemakerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Cakemaker', cakemakerSchema);